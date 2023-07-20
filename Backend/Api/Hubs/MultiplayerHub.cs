using Api.HubState;
using Microsoft.AspNetCore.SignalR;

namespace Api.Chathub;

public class MultiplayerHub : Hub
{
    private Dictionary<string, Dictionary<string, bool>> _groupReadinessState;

    public MultiplayerHub(IGroupReadinessState groupReadinessState)
    {
        _groupReadinessState = groupReadinessState.Groups;

    }

    public async Task JoinGame(string gameId)
    {
        if (_groupReadinessState.ContainsKey(gameId) && _groupReadinessState[gameId].ContainsKey(Context.ConnectionId))
            return;
        if (_groupReadinessState.ContainsKey(gameId) && _groupReadinessState[gameId].Count > 1)
            return;

        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

        if (_groupReadinessState.ContainsKey(gameId))
        {
            await Clients.Group(gameId).SendAsync("OpponentConnected", true);
            _groupReadinessState[gameId].Add(Context.ConnectionId, false);
        }
        else
        {
            _groupReadinessState.Add(gameId, new Dictionary<string, bool>() { { Context.ConnectionId, false } });
        }

    }

    public async Task TransferGameState(GameState data, TetroUnit[][] tetro, string gameId)
    {
        await Clients.OthersInGroup(gameId).SendAsync("RecieveGameState", data, tetro);
        await Clients.Group(gameId).SendAsync("OpponentReadyStatus", false);
        _groupReadinessState[gameId][Context.ConnectionId] = false;
    }

    public async Task LeaveGame(string gameId)
    {
        _groupReadinessState[gameId].Remove(Context.ConnectionId);

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        await Clients.Group(gameId).SendAsync("OpponentConnected", false);
    }

    public async Task SendReadinessStatus(bool readyStatus, string gameId)
    {
        if (!_groupReadinessState.ContainsKey(gameId))
            return;
        if (!_groupReadinessState[gameId].ContainsKey(Context.ConnectionId))
            return;

        _groupReadinessState[gameId][Context.ConnectionId] = readyStatus;
        await Clients.OthersInGroup(gameId).SendAsync("OpponentReadyStatus", readyStatus);

        if (!_groupReadinessState[gameId].ContainsValue(false) && _groupReadinessState[gameId].Values.Count == 2)
        {
            await Clients.Group(gameId).SendAsync("StartCountDown");
            foreach (var item in _groupReadinessState[gameId])
            {
                _groupReadinessState[gameId][item.Key] = false;
            }
            await Clients.Group(gameId).SendAsync("OpponentReadyStatus", false);
        }

    }

    public async Task SendGameData(GameState data, string gameId)
    {
        await Clients.OthersInGroup(gameId).SendAsync("ReceiveGameData", data);
    }

    public async Task SendTetromino(TetroUnit[][] data, string gameId)
    {
        await Clients.OthersInGroup(gameId).SendAsync("ReceiveTetromino", data);
    }

    public async Task SendTrashLine(string gameId)
    {
        await Clients.OthersInGroup(gameId).SendAsync("ReceiveTrashLine");
    }

    public async Task CreateNewGame()
    {
        var existingGame = GetGameId(Context.ConnectionId);
        if (existingGame != null)
        {
            await LeaveGame(existingGame);
        }

        var newId = GetUniqueId();

        await Clients.Caller.SendAsync("NewGameId", newId);
        await JoinGame(newId);
    }

    public async Task RequestRematch(bool readyStatus, string gameId)
    {
        await Clients.OthersInGroup(gameId).SendAsync("RecieveRematchRequest", readyStatus);
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {

        var gameId = GetGameId(Context.ConnectionId);

        if (!string.IsNullOrEmpty(gameId))
        {
            await LeaveGame(gameId);
        }

        await base.OnDisconnectedAsync(ex);
    }

    private string GetUniqueId()
    {
        var id = Guid.NewGuid().ToString().Substring(0, 5);
        if (_groupReadinessState.ContainsKey(id))
        {
            return GetUniqueId();
        }

        return id;
    }

    private string GetGameId(string ConnectionId) => _groupReadinessState.FirstOrDefault(x => x.Value.ContainsKey(Context.ConnectionId)).Key;

}


public record Position(int x, int y);
public record TetroUnit(int color, Position position);
public record GameState(int[][] playArea, int score, int clearedLines, TetroUnit[][] nextTetromino, bool gameOver);
