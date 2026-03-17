namespace Roamly.Housing.Api.Models
{
    public class HouseRules
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public bool SmokingAllowed { get; set; }
        public bool PetsAllowed { get; set; }
        public bool ChildrenAllowed { get; set; }
        public TimeSpan? CheckInFrom { get; set; }
        public TimeSpan? CheckOutBefore { get; set; }

        public Property? Property { get; set; }
    }
}
