namespace Api.HubState;
public class GroupReadinessState : IGroupReadinessState
{
    // I'm aware this is not scalable, if I had time I would've implemented redis
    public Dictionary<string, Dictionary<string, bool>> Groups { get; set; } = new();
}





