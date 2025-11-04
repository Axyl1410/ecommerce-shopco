# Profile Use Cases – PlantUML

This folder contains Clean Architecture diagrams for the Profile feature. Each diagram separates layers into:

- Entities Circle
- Use Case Circle (Interactor + Input/Output Boundary)
- Interface Adapters (Controllers, Presenters, DTO/ViewModel)
- Frameworks & Drivers (Spring MVC, JPA/Hibernate, DB)

## Diagrams

- UC01_OpenProfile.puml
- UC02_ViewProfile.puml
- UC03_EditProfile.puml
- UC04_SaveProfile.puml
- UC05_SetDefaultAddress.puml
- UC06A_CreateAddress.puml
- UC06B_ListAddresses.puml
- UC06C_UpdateAddress.puml
- UC06D_DeleteAddress.puml
- UC07_ViewActivities.puml

## How to render

You can render with the PlantUML VS Code extension or CLI.

### VS Code (recommended)
- Install: "PlantUML" extension by jebbs
- Open a `.puml` file and use "Preview Current Diagram"

### CLI (Java required)

```powershell
# From repo root
cd .\docs\profile-usecases
# Render all diagrams to PNG
java -jar plantuml.jar -tpng *.puml
```

Notes:
- The diagrams are conceptual and match the implemented endpoints and services in the backend.
- You can adjust names (e.g., controller class) if your packaging differs.
