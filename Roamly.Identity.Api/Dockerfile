FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Roamly.Identity.Api/Roamly.Identity.Api.csproj", "Roamly.Identity.Api/"]

RUN dotnet restore "Roamly.Identity.Api/Roamly.Identity.Api.csproj"

COPY ["Roamly.Identity.Api/", "Roamly.Identity.Api/"]
COPY ["Roamly.Shared.Events/", "Roamly.Shared.Events/"]

WORKDIR "/src/Roamly.Identity.Api"
RUN dotnet build "./Roamly.Identity.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "./Roamly.Identity.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Roamly.Identity.Api.dll"]