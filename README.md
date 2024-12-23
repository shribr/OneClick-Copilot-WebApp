# Azure AI Demo

## Overview

This project is a web application that allows users to chat with Azure Copilot. It includes a simple HTML interface and a PowerShell script for deployment.

<img width="1423" alt="azure-ai-demo-home" src="src/deployment/app/frontend/images/azure-ai-demo-home.png">

## Prerequisites

### Core Tools (Required)

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- [npm](https://www.npmjs.com/) (package management)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for deploying to Azure)
- [ms-vscode.azurecli](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli) - Azure CLI tools
- [ms-vscode.powershell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.powershell) - PowerShell language support
- [PowerShell Core](https://github.com/PowerShell/PowerShell) (for running the deployment script)

### .NET Development (Required)

- [ms-dotnettools.csharp](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) - C# language support
- [ms-dotnettools.dotnet-interactive-vscode](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode) - .NET Interactive Notebooks
- [ms-dotnettools.vscode-dotnet-pack](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-pack) - .NET Pack support
- [ms-dotnettools.vscode-dotnet-runtime](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-runtime) - .NET Runtime support
- [ms-dotnettools.vscode-dotnet-sdk](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscode-dotnet-sdk) - .NET SDK support

### GitHub Integration (Required)

- [github.vscode-github-actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) - GitHub Actions support

### Azure Development Tools (Optional)

- [azps-tools.azps-tools](https://marketplace.visualstudio.com/items?itemName=azps-tools.azps-tools) - Azure PowerShell tools
- [azurite.azurite](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) - Azure Storage emulator
- [ms-azure-devops.azure-pipelines](https://marketplace.visualstudio.com/items?itemName=ms-azure-devops.azure-pipelines) - Azure Pipelines support
- [ms-azuretools.azure-dev](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev) - Azure development tools
- [ms-azuretools.vscode-apimanagement](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement) - Azure API Management tools
- [ms-azuretools.vscode-azure-functions-web](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-functions-web) - Azure Functions tools
- [ms-azuretools.vscode-azureappservice](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) - Azure App Service tools
- [ms-azuretools.vscode-azurefunctions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) - Azure Functions tools
- [ms-azuretools.vscode-azureresourcegroups](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) - Azure Resource Groups tools
- [ms-azuretools.vscode-azurestaticwebapps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - Azure Static Web Apps tools
- [ms-azuretools.vscode-azurestorage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) - Azure Storage tools
- [ms-azuretools.vscode-azurevirtualmachines](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurevirtualmachines) - Azure Virtual Machines tools
- [ms-azuretools.vscode-bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) - Bicep language support

### GitHub Integration (Optional)

- [github.codespaces](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) - GitHub Codespaces support
- [github.github-vscode-theme](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme) - GitHub theme for VS Code
- [github.remotehub](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) - GitHub integration for remote repositories
- [github.vscode-pull-request-github](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) - GitHub Pull Requests and Issues

### AI Tools (Optional)

- [ms-toolsai.vscode-ai](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai) - AI tools for VS Code
- [ms-toolsai.vscode-ai-inference](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai-inference) - AI Inference tools
- [ms-toolsai.vscode-ai-remote](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai-remote) - AI Remote tools
- [ms-toolsai.vscode-ai-remote-web](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai-remote-web) - AI Remote Web tools

### Remote Development (Optional)

- [ms-vscode-remote.remote-containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) - Remote Containers support
- [ms-vscode-remote.remote-wsl](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) - Remote WSL support
- [ms-vscode.remote-explorer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-explorer) - Remote Explorer
- [ms-vscode.remote-repositories](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-repositories) - Remote Repositories
- [ms-vscode.remote-server](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-server) - Remote Server

### Miscellaneous Tools (Optional)

- [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter
- [ms-vscode.azure-account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) - Azure Account management
- [ms-vscode.azure-repos](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-repos) - Azure Repos support
- [ms-vscode.live-server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - Live Server for local development
- [ms-vscode.vscode-node-azure-pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) - Node.js Azure Pack
- [ms-vsliveshare.vsliveshare](https://marketplace.visualstudio.com/items?itemName=ms-vsliveshare.vsliveshare) - Live Share for collaboration
- [msazurermtools.azurerm-vscode-tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) - Azure Resource Manager tools
- [redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) - YAML language support

## Getting Started

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/azure-ai-demo.git

   cd azure-ai-demo

   ```

2. Install [Node](https://nodejs.org/) and then install the required VS Code extensions ([extensions.txt](./src/deployment/extensions.txt)) using the following script (make sure you are in the `src/deployment directory`):

   ```
   function Install-Extensions {
    # Define the path to the text file
    $filePath = "extensions.txt"

    # Read all lines from the file
    $extensions = Get-Content -Path $filePath

    # Loop through each extension and install it using the `code` command
    foreach ($extension in $extensions) {
        code --install-extension $extension
    }
   }

   ```

### Deployment

The main PowerShell script [Azure AI Demo Deployment.ps1](./src/deployment/Azure%20AI%20Demo%20Deployment.ps1) automates the deployment of all the required Azure resources for this custom Copilot web application. There is a template titled [parameters.json](./src/deployment/parameters.json) which contains configuration settings for every aspect of the deployment. It includes initialization, helper functions, resource creation, update functions, and logging to ensure a smooth and automated deployment process.

Once the deployment script completes the following resources should have been created in the resource group:

- App Service
- App Service Plan
- Application Insights
- Azure AI Hub
- Azure AI Services
- Azure AI Services Multi-Service Account
- Azure Machine Learning Registry
- Azure Machine Learning Workspace
- Azure OpenAI
- Document Intelligence
- Function App
- Key Vault
- Log Analytics Workspace
- Managed Identity
- Search Service
- Smart Detector Alert Rule
- Storage Account

The image below shows a diagram of the deployed resources:

<img width="1423" alt="azure-ai-demo-resource-visualizer" src="src/deployment/app/frontend/images/azure-ai-demo-resource-visualizer.png">

### Workflow of the Script

1. **Initialization and Setup:**

   - The script begins by setting the default parameters file (`parameters.json`).
   - Defines global variables for resource types and KeyVault secrets.
   - Sets the deployment path based on the current location.

2. **Parameter Initialization:**

   - The `Initialize-Parameters` function reads parameters from the specified JSON file.
   - Sets global variables for various Azure resources and configurations.
   - Retrieves the subscription ID, tenant ID, object ID, and user principal name using Azure CLI commands.

3. **Resource Creation Functions:**

   - The script defines multiple functions to create various Azure resources, such as:
     - `New-ResourceGroup`: Creates a new resource group.
     - `New-Resources`: Creates multiple Azure resources like storage accounts, app service plans, search services, etc.
     - `New-AppService`: Creates and deploys app services (web apps or function apps).
     - `New-KeyVault`: Creates a Key Vault and sets access policies.
     - `New-ManagedIdentity`: Creates a new managed identity.
     - `New-PrivateEndPoint`: Creates a new private endpoint.
     - `New-SearchDataSource`, `New-SearchIndex`, `New-SearchIndexer`: Create search-related resources.
     - `New-VirtualNetwork`, `New-SubNet`: Create virtual network and subnets.
     - `New-AIHubAndModel`: Creates AI Hub and AI Model.
     - `New-ApiManagementService`: Creates and deploys API Management service.

4. **Helper Functions:**

   - The script includes several helper functions for various tasks, such as:
     - `ConvertTo-ProperCase`: Converts a string to proper case.
     - `Deploy-OpenAIModel`: Deploys an Azure AI model.
     - `Find-AppRoot`: Finds the app root directory.
     - `Format-ErrorInfo`, `Format-CustomErrorInfo`: Format error information.
     - `Get-CognitiveServicesApiKey`: Retrieves the API key for Cognitive Services.
     - `Get-DataSources`: Tests if a datasource exists.
     - `Get-LatestApiVersion`: Gets the latest API version for a resource type.
     - `Get-LatestDotNetRuntime`: Gets the latest .NET runtime version.
     - `Get-RandomInt`: Generates a random integer.
     - `Get-Parameters-Sorted`: Alphabetizes the parameters object.
     - `Get-SearchIndexes`, `Get-SearchIndexers`, `Get-SearchSkillSets`: Check if a search index, indexer, or skillset exists.
     - `Get-UniqueSuffix`: Finds a unique suffix for resource names.
     - `Get-ValidServiceName`: Ensures the service name is valid.
     - `Install-Extensions`: Installs Visual Studio Code extensions.
     - `Invoke-AzureRestMethod`: Invokes an Azure REST API method.
     - `Initialize-Parameters`: Initializes the parameters.
     - `New-AIHub`: Creates a new AI Hub.
     - `New-AIService`: Creates a new AI Service.
     - `New-AIHubConnection`: Creates a new AI Hub connection.
     - `New-AIProject`: Creates a new AI project.
     - `New-ApiManagementService`: Creates and deploys API Management service.
     - `New-AppService`: Creates and deploys app services (web apps or function apps).
     - `New-ApplicationInsights`: Creates a new Application Insights component.
     - `New-AppServiceEnvironment`: Creates a new App Service Environment (ASE).
     - `New-AppServicePlan`: Creates a new App Service Plan.
     - `New-AppServicePlanInASE`: Creates a new App Service Plan in an App Service Environment (ASE).
     - `New-CognitiveServicesAccount`: Creates a new Azure Cognitive Services account.
     - `New-ComputerVisionAccount`: Creates a new Computer Vision account.
     - `New-ContainerRegistry`: Creates a new container registry.
     - `New-DocumentIntelligenceAccount`: Creates a new document intelligence account.
     - `New-KeyVault`: Creates a new key vault.
     - `New-LogAnalyticsWorkspace`: Creates a new Log Analytics workspace.
     - `New-ManagedIdentity`: Creates a new managed identity.
     - `New-MachineLearningWorkspace`: Creates a new machine learning workspace (Azure AI Project).
     - `New-OpenAIAccount`: Creates a new OpenAI account.
     - `New-PrivateEndPoint`: Creates a new private endpoint.
     - `New-RandomPassword`: Generates a random password.
     - `New-ResourceGroup`: Creates a new resource group.
     - `New-Resources`: Creates multiple Azure resources.
     - `New-SearchDataSource`: Creates a new search datasource.
     - `New-SearchIndex`: Creates a new search index.
     - `New-SearchIndexer`: Creates a new search indexer.
     - `New-SearchService`: Creates a new search service.
     - `New-SearchSkillSet`: Creates a new skillset.
     - `New-StorageAccount`: Creates a new storage account.
     - `New-SubNet`: Creates a new subnet.
     - `New-VirtualNetwork`: Creates a new virtual network.
     - `Remove-AzureResourceGroup`: Deletes Azure resource groups.
     - `Remove-MachineLearningWorkspace`: Deletes a Machine Learning Workspace.
     - `Reset-SearchIndexer`: Resets a search indexer.
     - `Restore-SoftDeletedResource`: Restores soft-deleted resources.
     - `Set-DirectoryPath`: Sets the directory location.
     - `Set-KeyVaultAccessPolicies`, `Set-KeyVaultRoles`, `Set-KeyVaultSecrets`: Manage Key Vault access and secrets.
     - `Set-RBACRoles`: Assigns RBAC roles to a managed identity.
     - `Split-Guid`: Splits a GUID and returns the first 8 characters.
     - `Start-Deployment`: Starts the deployment.
     - `Start-SearchIndexer`: Runs a search indexer.
     - `Test-DirectoryExists`: Checks if a directory exists and creates it if not.
     - `Test-ResourceGroupExists`, `Test-ResourceExists`: Check if a resource group or resource exists.
     - `Test-SubnetExists`: Checks if a subnet exists.
     - `Update-ParameterFileApiVersions`: Updates the `parameters.json` file with the latest API versions for Azure resources.
     - `Update-ContainerRegistryFile`: Updates the container registry configuration file with new settings.
     - `Update-MLWorkspaceFile`: Updates the machine learning workspace configuration file with new parameters.
     - `Update-AIConnectionFile`: Updates the AI connection configuration file with new connection details.
     - `Update-SearchIndexFiles`: Updates the search index configuration files with new index settings.
     - `Update-AIProjectFile`: Updates the AI project configuration file with new project details.
     - `Update-ConfigFile`: Update configuration files to be used by front-end JavaScript code. This includes all of the service names, urls and any newly generated API keys.
     - `Write-Log`: Writes messages to a log file.

5. **Main Script Execution:**

   - Initialize parameters by calling `Initialize-Parameters`.
   - Sets the user-assigned identity name.
   - Sets the directory path to the deployment path.
   - Starts the deployment by calling `Start-Deployment`.

6. **Deployment Process:**

   - The `Start-Deployment` function orchestrates the deployment process:
   - Initializes the sequence number and check if the log file exists.
   - Logs the start time and sequence number.
   - Checks if the resource group exists and create it if necessary.
   - Creates various Azure resources by calling the respective functions.
   - Logs the total execution time and write it to the log file.

### Project Structure

- **Azure AI Demo Deployment.ps1**: Main deployment script.
- **CognitiveServices.json**: Configuration file for Cognitive Services.
- **app/**: Directory for application-specific files.
  - **ai.connection.yaml**: AI connection configuration file.
  - **container.registry.yaml**: Container registry configuration file.
  - **frontend/**: Contains frontend application files.
    - **config.blank.json**: Blank configuration file for the frontend.
    - **config.json**: Configuration file for the frontend.
    - **css/**: Directory for CSS files.
      - **styles.css**: Main stylesheet.
    - **favicon.ico**: Favicon for the frontend.
    - **images/**: Directory for image files.
      - **Azure-AI-Demo-Azure-Resource-Visualizer.png**: Screenshot image.
      - **favicon.png**: Favicon image.
      - **azure-ai-demo-chat.png**: Chat screenshot.
      - **azure-ai-demo-existing-docs.png**: Existing documents screenshot.
      - **azure-ai-demo-selected-docs.png**: Documents selected for upload.
      - **azure-ai-demo-upload-docs.png**: Upload documents interface.
      - **tech_ai_background.jpg**: Background image.
      - **site-logo-custom.png**: Custom site logo used for branding.
      - **site-logo-default.png**: Default site logo (generic office building).
    - **index.html**: Main HTML file for the frontend.
    - **scripts/**: Directory for JavaScript files.
      - **script.js**: Main JavaScript file.
    - **web.config**: Web configuration file.
  - **functions/**: Directory for Azure Functions.
    - **chat/**: Directory for chat-related functions.
      - **AIChatCompletion.cs**: AI chat completion function.
      - **ChatCompletion.cs**: Chat completion function.
      - **ChatCompletion.csproj**: Project file for chat completion.
      - **ChatCompletion.sln**: Solution file for chat completion.
      - **ChatContext.cs**: Chat context class.
      - **ChatHistory.cs**: Chat history class.
      - **ChatOrchestrator.cs**: Chat orchestrator class.
      - **IChatCompletion.cs**: Interface for chat completion.
      - **Properties/**: Directory for project properties.
        - **launchSettings.json**: Launch settings for the project.
  - **ml.workspace.yaml**: Machine learning workspace configuration file.
  - **package-lock.json**: NPM package lock file.
  - **package.json**: NPM package file.
  - **temp/**: Temporary files directory.
- **deployment.log**: Log file for the deployment process.
- **directory_structure.txt**: File containing the directory structure.
- **launch.json**: Launch configuration file.
- **parameters backup.json**: Backup of parameters file.
- **parameters.json**: Parameters file for the deployment.
- **search-index-schema.json**: Search index schema file.
- **search-indexer-schema.json**: Search indexer schema file.
- **server.js**: Local http server JavaScript file.
- **settings.json**: Settings file.

### Directory Structure

```plaintext

├── Azure AI Demo Deployment.ps1
├── CognitiveServices.json
├── app
│   ├── ai.connection.yaml
│   ├── container.registry.yaml
│   ├── frontend
│   │   ├── config.blank.json
│   │   ├── config.json
│   │   ├── css
│   │   │   ├── styles.css
│   │   ├── favicon.ico
│   │   ├── images
│   │   │   ├── azure-ai-demo-chat.png
│   │   │   ├── azure-ai-demo-existing-docs.png
│   │   │   ├── azure-ai-demo-selected-docs.png
│   │   │   ├── azure-ai-demo-upload-docs.png
│   │   │   ├── building.png
│   │   │   ├── favicon.png
│   │   │   ├── site-logo-custom.png
│   │   │   ├── site-logo-default.png
│   │   │   └── tech_ai_background.jpg
│   │   ├── index.html
│   │   ├── scripts
│   │   │   └── script.js
│   │   └── web.config
│   ├── functions
│   │   └── chat
│   │       ├── AIChatCompletion.cs
│   │       ├── ChatCompletion.cs
│   │       ├── ChatCompletion.csproj
│   │       ├── ChatCompletion.sln
│   │       ├── ChatContext.cs
│   │       ├── ChatHistory.cs
│   │       ├── ChatOrchestrator.cs
│   │       ├── IChatCompletion.cs
│   │       ├── host.json
│   ├── ml.workspace.yaml
│   ├── package-lock.json
│   ├── package.json
│   └── temp
├── deployment.log
├── launch.json
├── parameters.json
├── search-index-schema.json
├── search-indexer-schema.json
├── server.js
└── settings.json

```

### Development Server

For testing you can use the built-in VS Code Live Server (uses port 5500 by default) or use the local Node server (uses port 3000 by default) by navigating to the `src/deployment` directory and running the following command:

```

node server.js

```

### Solution Architecture

The web application is structured to leverage various Azure services for a seamless and scalable deployment. The architecture includes:

- **Frontend**: The frontend is built using HTML, CSS, and JavaScript, located in the frontend directory. It includes configuration files, stylesheets, images, and scripts necessary for the user interface.

- **Backend**: The backend consists of Azure Functions, specifically designed for chat-related functionalities. These functions are located in the chat directory and include classes like `ChatCompletion`, `ChatContext`, `ChatHistory`, and `ChatOrchestrator`.

This architecture ensures a robust, scalable, and maintainable web application leveraging Azure's cloud capabilities.

![image](https://github.com/user-attachments/assets/cf08f9d3-41dd-4f80-99cd-afbd4d9dca2c)

### Web Application Screens

The index.html file includes the following screens:

<img width="1423" alt="azure-ai-demo-home" src="src/deployment/app/frontend/images/azure-ai-demo-home.png">

<img width="1423" alt="azure-ai-demo-upload-docs" src="src/deployment/app/frontend/images/azure-ai-demo-upload-docs.png">

<img width="1410" alt="azure-ai-demo-chat" src="src/deployment/app/frontend/images/azure-ai-demo-chat.png">

<img width="1409" alt="azure-ai-demo-response" src="src/deployment/app/frontend/images/azure-ai-demo-response.png">

<img width="1879" alt="azure-ai-demo-settings" src="src/deployment/app/frontend/images/azure-ai-demo-settings.png">

<img width="1153" alt="azure-ai-demo-selected-docs" src="src/deployment/app/frontend/images/azure-ai-demo-selected-docs.png">

<img width="1164" alt="azure-ai-demo-existing-docs" src="src/deployment/app/frontend/images/azure-ai-demo-existing-docs.png">

### Chat Workflow

For a more in-depth understanding of the chat workflow click [here](./README_CHATWORKFLOW.md)

### Manual Deployment Steps:

There are several manual steps which need to be performed for a variety of reasons but mainly because neither the Azure CLI or PowerShell have been fully updated to allow certain tasks to be executed fully. Much of the documentation is still incomplete and several of the specs are actually incorrect at the time of this writing.

1. Setting CORS to allow "All" for Azure Storage Service.
   <img width="1164" alt="Setting CORS" src="src/deployment/app/frontend/images/azure-ai-demo-storage-cors-config.png" style="box-shadow: 10px 10px 5px #888888;">

2. Setting managed identity type to "User-Assigned" for the Azure Search Service datasource. On the same screen you also need to set the blob container to "content". Note: At the time of this writing, there is a bug where the UI in the Azure Portal does not show that your settings have been changed.
   <img width="1164" alt="Managed Identity" src="src/deployment/app/frontend/images/azure-ai-demo-search-datasource-managed-identity-config.png" style="box-shadow: 10px 10px 5px #888888;">

3. Setting the multi-service account The Azure Search Service indexer's vectorizer to the Azure AI Service multi-service account (i.e. the resource with the cog- prefix). You have to go to the Index settings for each search index to apply this change. Alternatively you can click "import and vectorize data" link at the top of the search screen in the Azure Portal. Select you storage account, blob name, select the managed identity, select AI Vision Vectorized for the "kind" field, select the multi-service account with the "cog-" prefix.
   <img width="1164" alt="Multi-Service Account" src="src/deployment/app/frontend/images/azure-ai-demo-search-index-vectorizer-multi-service-account-config.png" style="box-shadow: 10px 10px 5px #888888;">
4. Azure AI Project / Machine Learning Workspace:
   <img width="1164" alt="Machine Learning Workspace" src="src/deployment/app/frontend/images/azure-ai-demo-manage-hubs-and-projects.png" style="box-shadow: 10px 10px 5px #888888;">

Despite the official Microsoft [Azure Machine Learning Workspace schema](https://azuremlschemas.azureedge.net/latest/workspace.schema.json) documentation showing a whole list of parameters that are available, the `az ml workspace create` command will only accept the following parameters:

```
--name
--description
--display-name
--resource-group
--application-insights
--location
--key-vault
--storage-account
```

The problem with this is that this solution needs to have an Azure AI project created and associated with the Azure Hub deployed in the resource group. Now, despite the official documentation stating that the parameters `kind` and `hub-id` do exist (albeit currently in preview mode) you cannot set either of those parameters using the Azure CLI. Here's where things get a little confusing. By not having the ability to specify values for those parameters, the "project" gets created as an **Azure Machine Learning Workspace** and it will only be available in **Azure Machine Learning Studio** as opposed to **Azure AI Studio** (recently renamed to **Azure AI Foundry**). Hence the reason why I titled this first item as **Azure AI Project / Machine Learning Workspace**. What this essentially means is that this resource can either be created in **Azure AI Foundary** or **Azure Machine Learning Studio** depending on where you ultimately decide to create it. Regardless of where the resource is created, it will display in your Resource Group. However, it will have different "purposes" and "structure" depending on where you provision it. Now, at this point you might be asking why you need to have either one in the first place. Well, the nice part about having a project/workspace is that it allows you to better organize your AI resources (i.e. models, endpoints, connected resources like Azure Blob Storage, OpenAI Services, Azure AI Services, Vision Services etc.) similar to how a resource group allows you to organize your cloud resources. In addition, you can invite people to your project/workspace without having to define explicit permissions for each and every resource.

Even trying to pass in a yaml file instead of specifying the parameters directly in the command won't work if you include any other parameters than the ones listed above. So it's kind of annoying because this entire solution would literllay be "one-click" if not for the handful of aforementioned manual steps.

Anyhow, once the project is created you need to make sure to set the quota to dynamic in order to actually make more than just a handful of REST API calls. This however can get pricey so make sure to check your budget before you go nuts.

### Additional Notes

**REST APIs**
It is important to note that the technologies used by this solution are changing by the second. New versions of libraries and APIs are being released constantly and documentation is being updated on a near weekly basis. Since this solution leverages REST APIs, ensuring that you are using the most up-to-date API version for each service's API is absolutely critical. With each new API release, new capabilities are added (and sometimes existing ones removed).

A perfect example is the Azure [Search Service API](https://learn.microsoft.com/en-us/rest/api/searchservice/search-service-api-versions). There is actually documentation for how to migrate to the newest version of the API located [here](https://learn.microsoft.com/en-us/rest/api/searchservice/search-service-api-versions). In the documentation, it actually says "2023-07-01-preview was the first REST API for vector support. Do not use this API version. It's now deprecated and you should migrate to either stable or newer preview REST APIs immediately."

Lucky for you this solution defines all of the API versions in the parameters.json file. When newer versions of a particular API are resleased, you just need to update that file and redeploy the web application. The PowerShell script regenerates the config.json file that is deployed as part of the web application zip package using the new values defined in the parameters.json file.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
