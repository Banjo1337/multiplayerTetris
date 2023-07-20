namespace Api.HubState;
public interface IGroupReadinessState
{
    Dictionary<string, Dictionary<string, bool>> Groups { get; set; }
}


