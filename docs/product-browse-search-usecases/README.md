# Product Browse & Search Use Cases – PlantUML

This folder contains Clean Architecture diagrams for the Product Browsing and Search feature. Each diagram separates layers into:

- Entities Circle
- Use Case Circle (Interactor + Input/Output Boundary)
- Interface Adapters (Controllers, Presenters, DTO/ViewModel)
- Frameworks & Drivers (Spring MVC, JPA/Hibernate, DB)

## Diagrams

- UC01_BrowseProducts.puml - Browse product catalog with default settings
- UC02_FilterProducts.puml - Filter products by category, brand, price, colors, sizes, tags
- UC03_SortProducts.puml - Sort products by various criteria
- UC04_PaginateProducts.puml - Navigate through product pages
- UC05_SearchProducts.puml - Search products by text query
- UC06_ViewProductDetails.puml - View detailed information about a specific product

## How to render

You can render with the PlantUML VS Code extension or CLI.

### VS Code (recommended)
- Install: "PlantUML" extension by jebbs
- Open a `.puml` file and use "Preview Current Diagram"

### CLI (Java required)

```bash
# From repo root
cd ./docs/product-browse-search-usecases
# Render all diagrams to PNG
java -jar plantuml.jar -tpng *.puml
```

### Online viewer
- Visit: https://www.plantuml.com/plantuml/uml/
- Copy and paste the content of any `.puml` file

## Notes
- The diagrams are conceptual and match the implemented endpoints and services in the backend.
- You can adjust names (e.g., controller class) if your packaging differs.
- All use cases follow Clean Architecture principles with clear separation of concerns.
