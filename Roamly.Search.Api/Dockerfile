FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Roamly.Search.Api/Roamly.Search.Api.csproj", "Roamly.Search.Api/"]
COPY ["Roamly.Housing.Api/Roamly.Housing.Api.csproj", "Roamly.Housing.Api/"]

RUN dotnet restore "Roamly.Search.Api/Roamly.Search.Api.csproj"

COPY . .

WORKDIR "/src/Roamly.Search.Api"
RUN dotnet build "./Roamly.Search.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish

RUN rm -f /src/Roamly.Housing.Api/appsettings*.json || true
RUN dotnet publish "./Roamly.Search.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Roamly.Search.Api.dll"]