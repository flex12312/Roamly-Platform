namespace Roamly.Housing.Api.DTOs.Requests
{
    public class AddHouseRulesRequestDto
    {
        public bool SmokingAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public bool ChildrenAllowed { get; set; }
        public TimeSpan? CheckInFrom { get; set; }
        public TimeSpan? CheckOutBefore { get; set; }
    }
}