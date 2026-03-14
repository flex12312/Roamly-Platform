using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Roamly.Housing.Api.Data;
using Roamly.Housing.Api.DTOs.Responses;
using Roamly.Housing.Api.Interfaces;
using Roamly.Housing.Api.Models;

namespace Roamly.Housing.Api.Services
{
    public class PropertyPhotoService : IPropertyPhotoService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly HousingDbContext _dbContext;   
        private readonly IMapper _mapper;
        public PropertyPhotoService(IWebHostEnvironment webHostEnvironment,HousingDbContext dbContext,IMapper mapper)
        {
            _webHostEnvironment = webHostEnvironment;
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<bool> DeletePhotoAsync(int photoId, string ownerId)
        {
            var photo = await _dbContext.PropertyPhotos.Include(p => p.Property).FirstOrDefaultAsync(p => p.Id == photoId);
            if (photo == null) return false;

            if (photo.Property.OwnerId != ownerId) return false;

            var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", photo.ImageUrl.TrimStart('/'));
            if (File.Exists(filePath)) File.Delete(filePath);
            
            _dbContext.PropertyPhotos.Remove(photo);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<PropertyPhotoResponseDto>> GetPhotosAsync(int propertyId)
        {
            var photos = await _dbContext.PropertyPhotos.Where(p => p.PropertyId == propertyId).OrderBy(p => p.Order).ToListAsync();

            return _mapper.Map<IEnumerable<PropertyPhotoResponseDto>>(photos);
        }

        public async Task<bool> SetPrimaryPhotoAsync(int photoId, string ownerId)
        {
            var photo = await _dbContext.PropertyPhotos.Include(p => p.Property).FirstOrDefaultAsync(p => p.Id == photoId);
            if (photo == null || photo.Property.OwnerId != ownerId) return false;

            var allPhotos = await _dbContext.PropertyPhotos.Where(p => p.PropertyId == photo.PropertyId).ToListAsync();
            foreach (var p in allPhotos)
            {
                p.IsMain = false;  
            }
            photo.IsMain = true;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<PropertyPhotoResponseDto?> UploadPhotoAsync(int propertyId, IFormFile file, string ownerId)
        {
            var property = await _dbContext.Properties.FirstOrDefaultAsync(p => p.Id == propertyId && p.OwnerId == ownerId);
            if (property == null) return null;

            var uploadsFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot", "uploads", "properties", propertyId.ToString());
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photosCount = await _dbContext.PropertyPhotos.CountAsync(p => p.PropertyId == propertyId);
            var isMain = photosCount == 0;

            var photo = new PropertyPhoto
            {
                PropertyId = propertyId,
                ImageUrl = $"/uploads/properties/{propertyId}/{fileName}",
                ContentType = file.ContentType,
                IsMain = isMain,
                Order = photosCount
            };

            _dbContext.PropertyPhotos.Add(photo);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<PropertyPhotoResponseDto>(photo);
        }
    }
}