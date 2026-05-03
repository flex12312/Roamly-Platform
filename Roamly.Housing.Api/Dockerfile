FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Roamly.Shared.Events/Roamly.Shared.Events.csproj", "Roamly.Shared.Events/"]
COPY ["Roamly.Housing.Api/Roamly.Housing.Api.csproj", "Roamly.Housing.Api/"]

RUN dotnet restore "Roamly.Housing.Api/Roamly.Housing.Api.csproj"

COPY ["Roamly.Housing.Api/", "Roamly.Housing.Api/"]
COPY ["Roamly.Shared.Events/", "Roamly.Shared.Events/"]

WORKDIR "/src/Roamly.Housing.Api"
RUN dotnet build "./Roamly.Housing.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "./Roamly.Housing.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Roamly.Housing.Api.dll"]