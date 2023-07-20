namespace Api.Dtos;

public class UserSignUpRequestDto : UserRequestDto 
{
    public required string DisplayName { get; set; }
}
