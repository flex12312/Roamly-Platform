FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Roamly.Shared.Events/Roamly.Shared.Events.csproj", "Roamly.Shared.Events/"]
COPY ["Roamly.Housing.Api/Roamly.Housing.Api.csproj", "Roamly.Housing.Api/"]
COPY ["Roamly.Booking.Api/Roamly.Booking.Api.csproj", "Roamly.Booking.Api/"]

RUN dotnet restore "Roamly.Booking.Api/Roamly.Booking.Api.csproj"

COPY ["Roamly.Booking.Api/", "Roamly.Booking.Api/"]
COPY ["Roamly.Housing.Api/", "Roamly.Housing.Api/"]
COPY ["Roamly.Shared.Events/", "Roamly.Shared.Events/"]

WORKDIR "/src/Roamly.Booking.Api"
RUN dotnet build "./Roamly.Booking.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish

RUN rm -f /src/Roamly.Housing.Api/appsettings*.json || true

RUN dotnet publish "./Roamly.Booking.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Roamly.Booking.Api.dll"]