namespace Roamly.Housing.Api.DTOs.Responses
{
    public class HouseRulesResponseDto
    {
        public int Id { get; set; }
        public bool SmokingAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public bool ChildrenAllowed { get; set; }
        public TimeSpan? CheckInFrom { get; set; }
        public TimeSpan? CheckOutBefore { get; set; }
    }
}