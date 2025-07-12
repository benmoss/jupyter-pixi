import { Widget } from '@lumino/widgets';
import { PixiService } from './pixi-service';

export class PixiWidget extends Widget {
  private pixiService: PixiService;
  private contentDiv!: HTMLDivElement;

  constructor() {
    super();
    this.pixiService = new PixiService();
    this.addClass('jp-pixi-widget');
    this.createContent();
    this.loadProjectInfo();
  }

  private createContent(): void {
    this.contentDiv = document.createElement('div');
    this.contentDiv.className = 'jp-pixi-content';
    this.node.appendChild(this.contentDiv);
  }

  private setupEventListeners(): void {
    const refreshBtn = this.contentDiv.querySelector('#refresh-btn');
    const environmentsBtn = this.contentDiv.querySelector('#environments-btn');
    const packagesBtn = this.contentDiv.querySelector('#packages-btn');
    const tasksBtn = this.contentDiv.querySelector('#tasks-btn');
    const setupBtn = this.contentDiv.querySelector('#setup-btn');

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshProject());
    }
    if (environmentsBtn) {
      environmentsBtn.addEventListener('click', () => this.showEnvironments());
    }
    if (packagesBtn) {
      packagesBtn.addEventListener('click', () => this.showPackages());
    }
    if (tasksBtn) {
      tasksBtn.addEventListener('click', () => this.showTasks());
    }
    if (setupBtn) {
      setupBtn.addEventListener('click', () => this.showSetup());
    }
  }

  private async loadProjectInfo(): Promise<void> {
    try {
      const projectInfo = await this.pixiService.getProjectInfo();
      this.renderProjectInfo(projectInfo);
    } catch (error) {
      this.renderError('Failed to load project information');
    }
  }

  private renderProjectInfo(projectInfo: any): void {
    this.contentDiv.innerHTML = `
      <div class="jp-pixi-header">
        <h2>Pixi Package Manager</h2>
      </div>
      <div class="jp-pixi-project-info">
        <div class="jp-pixi-section">
          <h3>Project Information</h3>
          <div class="jp-pixi-info-grid">
            <div class="jp-pixi-info-item">
              <label>Project Name:</label>
              <span>${projectInfo.name || 'Not a pixi project'}</span>
            </div>
            <div class="jp-pixi-info-item">
              <label>Current Environment:</label>
              <span>${projectInfo.currentEnvironment || 'None'}</span>
            </div>
            <div class="jp-pixi-info-item">
              <label>Available Environments:</label>
              <span>${projectInfo.environments?.join(', ') || 'None'}</span>
            </div>
          </div>
        </div>
        <div class="jp-pixi-section">
          <h3>Quick Actions</h3>
          <div class="jp-pixi-actions">
            <button class="jp-pixi-button" id="refresh-btn">Refresh Project</button>
            <button class="jp-pixi-button" id="environments-btn">Manage Environments</button>
            <button class="jp-pixi-button" id="packages-btn">Manage Packages</button>
            <button class="jp-pixi-button" id="tasks-btn">Run Tasks</button>
            <button class="jp-pixi-button" id="setup-btn">Project Setup</button>
          </div>
        </div>
      </div>
    `;
    this.setupEventListeners();
  }

  private renderError(message: string): void {
    this.contentDiv.innerHTML = `
      <div class="jp-pixi-error">
        <h3>Error</h3>
        <p>${message}</p>
        <button class="jp-pixi-button" onclick="this.loadProjectInfo()">Retry</button>
      </div>
    `;
  }

  // Public methods for button actions
  public refreshProject(): void {
    this.loadProjectInfo();
  }

  public showEnvironments(): void {
    this.renderEnvironmentManager();
  }

  public showPackages(): void {
    this.renderPackageManager();
  }

  public showTasks(): void {
    this.renderTaskManager();
  }

  public showSetup(): void {
    this.renderProjectSetup();
  }

  private renderProjectSetup(): void {
    // Get current project info to determine if we're in a pixi project
    this.pixiService.getProjectInfo().then((projectInfo: any) => {
      if (projectInfo.isPixiProject) {
        this.renderExistingProjectSetup(projectInfo);
      } else {
        this.renderNewProjectSetup();
      }
    });
  }

  private renderExistingProjectSetup(projectInfo: any): void {
    this.contentDiv.innerHTML = `
      <div class="jp-pixi-header">
        <h2>Project Configuration</h2>
      </div>
      <div class="jp-pixi-section">
        <h3>Current Project: ${projectInfo.name}</h3>
        <div class="jp-pixi-project-details">
          <div class="jp-pixi-detail-item">
            <label>Project Name:</label>
            <span>${projectInfo.name}</span>
          </div>
          <div class="jp-pixi-detail-item">
            <label>Current Environment:</label>
            <span>${projectInfo.currentEnvironment}</span>
          </div>
          <div class="jp-pixi-detail-item">
            <label>Environments:</label>
            <span>${projectInfo.environments?.length || 0} configured</span>
          </div>
          <div class="jp-pixi-detail-item">
            <label>Packages:</label>
            <span>${projectInfo.packages?.length || 0} installed</span>
          </div>
        </div>
      </div>
      <div class="jp-pixi-section">
        <h3>Configuration Options</h3>
        <div class="jp-pixi-config-actions">
          <button class="jp-pixi-button" id="jp-pixi-edit-config">Edit Configuration</button>
          <button class="jp-pixi-button" id="jp-pixi-reinit">Re-initialize Project</button>
          <button class="jp-pixi-button" id="jp-pixi-export">Export Configuration</button>
        </div>
      </div>
      <div class="jp-pixi-section">
        <button class="jp-pixi-button" id="jp-pixi-back-btn">Back</button>
      </div>
    `;
    this.setupProjectSetupListeners();
  }

  private renderNewProjectSetup(): void {
    this.contentDiv.innerHTML = `
      <div class="jp-pixi-header">
        <h2>Initialize New Pixi Project</h2>
      </div>
      <div class="jp-pixi-section">
        <h3>Project Information</h3>
        <form id="jp-pixi-init-form">
          <div class="jp-pixi-form-group">
            <label for="jp-pixi-project-name">Project Name:</label>
            <input type="text" id="jp-pixi-project-name" placeholder="my-pixi-project" required />
          </div>
          <div class="jp-pixi-form-group">
            <label for="jp-pixi-project-description">Description:</label>
            <textarea id="jp-pixi-project-description" placeholder="A brief description of your project"></textarea>
          </div>
          <div class="jp-pixi-form-group">
            <label for="jp-pixi-python-version">Python Version:</label>
            <select id="jp-pixi-python-version">
              <option value="3.9">Python 3.9</option>
              <option value="3.10">Python 3.10</option>
              <option value="3.11" selected>Python 3.11</option>
              <option value="3.12">Python 3.12</option>
            </select>
          </div>
          <div class="jp-pixi-form-group">
            <label for="jp-pixi-initial-packages">Initial Packages:</label>
            <input type="text" id="jp-pixi-initial-packages" placeholder="numpy, pandas, matplotlib" />
          </div>
          <button type="submit" class="jp-pixi-button">Initialize Project</button>
        </form>
      </div>
      <div class="jp-pixi-section">
        <button class="jp-pixi-button" id="jp-pixi-back-btn">Back</button>
      </div>
    `;
    this.setupProjectSetupListeners();
  }

  private setupProjectSetupListeners(): void {
    // Back button
    const backBtn = this.contentDiv.querySelector('#jp-pixi-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.loadProjectInfo());
    }

    // Initialize project form
    const initForm = this.contentDiv.querySelector('#jp-pixi-init-form');
    if (initForm) {
      initForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        this.initializeProject();
      });
    }

    // Configuration buttons
    const editConfigBtn = this.contentDiv.querySelector('#jp-pixi-edit-config');
    if (editConfigBtn) {
      editConfigBtn.addEventListener('click', () => this.editConfiguration());
    }

    const reinitBtn = this.contentDiv.querySelector('#jp-pixi-reinit');
    if (reinitBtn) {
      reinitBtn.addEventListener('click', () => this.reinitializeProject());
    }

    const exportBtn = this.contentDiv.querySelector('#jp-pixi-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportConfiguration());
    }
  }

  private async initializeProject(): Promise<void> {
    const projectName = (this.contentDiv.querySelector('#jp-pixi-project-name') as HTMLInputElement)?.value;
    const description = (this.contentDiv.querySelector('#jp-pixi-project-description') as HTMLTextAreaElement)?.value;
    const pythonVersion = (this.contentDiv.querySelector('#jp-pixi-python-version') as HTMLSelectElement)?.value;
    const initialPackages = (this.contentDiv.querySelector('#jp-pixi-initial-packages') as HTMLInputElement)?.value;

    if (!projectName) {
      this.showError('Project name is required');
      return;
    }

    try {
      await this.pixiService.initializeProject({
        name: projectName,
        description: description || '',
        pythonVersion,
        initialPackages: initialPackages ? initialPackages.split(',').map(p => p.trim()) : []
      });
      
      this.showSuccess('Project initialized successfully!');
      setTimeout(() => this.loadProjectInfo(), 2000);
    } catch (error) {
      this.showError('Failed to initialize project: ' + error);
    }
  }

  private async editConfiguration(): Promise<void> {
    try {
      await this.pixiService.editConfiguration();
      this.showSuccess('Configuration opened for editing');
    } catch (error) {
      this.showError('Failed to open configuration: ' + error);
    }
  }

  private async reinitializeProject(): Promise<void> {
    try {
      await this.pixiService.reinitializeProject();
      this.showSuccess('Project re-initialized successfully!');
      setTimeout(() => this.loadProjectInfo(), 2000);
    } catch (error) {
      this.showError('Failed to re-initialize project: ' + error);
    }
  }

  private async exportConfiguration(): Promise<void> {
    try {
      const config = await this.pixiService.exportConfiguration();
      this.showSuccess('Configuration exported successfully');
      console.log('Exported configuration:', config);
    } catch (error) {
      this.showError('Failed to export configuration: ' + error);
    }
  }

  private showSuccess(message: string): void {
    this.contentDiv.innerHTML += `
      <div class="jp-pixi-success-message">
        <span>✅ ${message}</span>
      </div>
    `;
  }

  private showError(message: string): void {
    this.contentDiv.innerHTML += `
      <div class="jp-pixi-error-message">
        <span>❌ ${message}</span>
      </div>
    `;
  }

  private renderPackageManager(): void {
    // Get the current packages from the service (simulate for now)
    this.pixiService.getInstalledPackages().then((packages: string[]) => {
      this.contentDiv.innerHTML = `
        <div class="jp-pixi-header">
          <h2>Manage Packages</h2>
        </div>
        <div class="jp-pixi-section">
          <h3>Installed Packages</h3>
          <ul class="jp-pixi-package-list">
            ${packages.map(pkg => `
              <li class="jp-pixi-package-item">
                <span>${pkg}</span>
                <button class="jp-pixi-remove-btn" data-pkg="${pkg}">Remove</button>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="jp-pixi-section">
          <h3>Add a Package</h3>
          <form id="jp-pixi-add-package-form">
            <input type="text" id="jp-pixi-add-package-input" placeholder="Package name" required />
            <button type="submit" class="jp-pixi-button">Add Package</button>
          </form>
        </div>
        <div class="jp-pixi-section">
          <button class="jp-pixi-button" id="jp-pixi-back-btn">Back</button>
        </div>
      `;
      this.setupPackageManagerListeners();
    });
  }

  private setupPackageManagerListeners(): void {
    // Remove package buttons
    const removeBtns = this.contentDiv.querySelectorAll('.jp-pixi-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (event: Event) => {
        const pkg = (event.target as HTMLButtonElement).getAttribute('data-pkg');
        if (pkg) {
          this.removePackage(pkg);
        }
      });
    });

    // Add package form
    const addForm = this.contentDiv.querySelector('#jp-pixi-add-package-form') as HTMLFormElement;
    if (addForm) {
      addForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        const input = this.contentDiv.querySelector('#jp-pixi-add-package-input') as HTMLInputElement;
        if (input && input.value.trim()) {
          this.addPackage(input.value.trim());
        }
      });
    }

    // Back button
    const backBtn = this.contentDiv.querySelector('#jp-pixi-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.loadProjectInfo());
    }
  }

  private async addPackage(pkg: string): Promise<void> {
    // Simulate adding a package
    await this.pixiService.executePixiCommand('add', [pkg]);
    this.renderPackageManager();
  }

  private async removePackage(pkg: string): Promise<void> {
    // Simulate removing a package
    await this.pixiService.executePixiCommand('remove', [pkg]);
    this.renderPackageManager();
  }

  private renderEnvironmentManager(): void {
    // Get current project info to access environments
    this.pixiService.getProjectInfo().then((projectInfo: any) => {
      this.contentDiv.innerHTML = `
        <div class="jp-pixi-header">
          <h2>Manage Environments</h2>
        </div>
        <div class="jp-pixi-section">
          <h3>Available Environments</h3>
          <div class="jp-pixi-environment-list">
            ${projectInfo.environments?.map((env: string) => `
              <div class="jp-pixi-environment-item ${env === projectInfo.currentEnvironment ? 'jp-pixi-current-env' : ''}">
                <span class="jp-pixi-env-name">${env}</span>
                <div class="jp-pixi-env-actions">
                  ${env !== projectInfo.currentEnvironment ? 
                    `<button class="jp-pixi-switch-btn" data-env="${env}">Switch</button>` : 
                    '<span class="jp-pixi-current-label">Current</span>'
                  }
                </div>
              </div>
            `).join('') || '<p>No environments found</p>'}
          </div>
        </div>
        <div class="jp-pixi-section">
          <h3>Create New Environment</h3>
          <form id="jp-pixi-create-env-form">
            <input type="text" id="jp-pixi-create-env-input" placeholder="Environment name" required />
            <button type="submit" class="jp-pixi-button">Create Environment</button>
          </form>
        </div>
        <div class="jp-pixi-section">
          <button class="jp-pixi-button" id="jp-pixi-back-btn">Back</button>
        </div>
      `;
      this.setupEnvironmentManagerListeners();
    });
  }

  private setupEnvironmentManagerListeners(): void {
    // Switch environment buttons
    const switchBtns = this.contentDiv.querySelectorAll('.jp-pixi-switch-btn');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', (event: Event) => {
        const env = (event.target as HTMLButtonElement).getAttribute('data-env');
        if (env) {
          this.switchEnvironment(env);
        }
      });
    });

    // Create environment form
    const createForm = this.contentDiv.querySelector('#jp-pixi-create-env-form') as HTMLFormElement;
    if (createForm) {
      createForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        const input = this.contentDiv.querySelector('#jp-pixi-create-env-input') as HTMLInputElement;
        if (input && input.value.trim()) {
          this.createEnvironment(input.value.trim());
        }
      });
    }

    // Back button
    const backBtn = this.contentDiv.querySelector('#jp-pixi-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.loadProjectInfo());
    }
  }

  private async switchEnvironment(env: string): Promise<void> {
    // Simulate switching environment
    await this.pixiService.executePixiCommand('env', ['switch', env]);
    this.renderEnvironmentManager();
  }

  private async createEnvironment(env: string): Promise<void> {
    // Simulate creating a new environment
    await this.pixiService.executePixiCommand('env', ['create', env]);
    this.renderEnvironmentManager();
  }

  private renderTaskManager(): void {
    // Get available tasks from the service
    this.pixiService.getAvailableTasks().then((tasks: any[]) => {
      this.contentDiv.innerHTML = `
        <div class="jp-pixi-header">
          <h2>Task Execution</h2>
        </div>
        <div class="jp-pixi-section">
          <h3>Available Tasks</h3>
          <div class="jp-pixi-task-list">
            ${tasks.map((task: any) => `
              <div class="jp-pixi-task-item">
                <div class="jp-pixi-task-info">
                  <span class="jp-pixi-task-name">${task.name}</span>
                  <span class="jp-pixi-task-description">${task.description}</span>
                </div>
                <button class="jp-pixi-run-task-btn" data-task="${task.name}">Run</button>
              </div>
            `).join('') || '<p>No tasks found</p>'}
          </div>
        </div>
        <div class="jp-pixi-section">
          <h3>Task Output</h3>
          <div class="jp-pixi-task-output" id="jp-pixi-task-output">
            <div class="jp-pixi-output-placeholder">No task running. Select a task to execute.</div>
          </div>
          <div class="jp-pixi-task-controls" id="jp-pixi-task-controls" style="display: none;">
            <button class="jp-pixi-button jp-pixi-stop-btn" id="jp-pixi-stop-task">Stop Task</button>
            <button class="jp-pixi-button jp-pixi-clear-btn" id="jp-pixi-clear-output">Clear Output</button>
          </div>
        </div>
        <div class="jp-pixi-section">
          <button class="jp-pixi-button" id="jp-pixi-back-btn">Back</button>
        </div>
      `;
      this.setupTaskManagerListeners();
    });
  }

  private setupTaskManagerListeners(): void {
    // Run task buttons
    const runTaskBtns = this.contentDiv.querySelectorAll('.jp-pixi-run-task-btn');
    runTaskBtns.forEach(btn => {
      btn.addEventListener('click', (event: Event) => {
        const taskName = (event.target as HTMLButtonElement).getAttribute('data-task');
        if (taskName) {
          this.runTask(taskName);
        }
      });
    });

    // Stop task button
    const stopBtn = this.contentDiv.querySelector('#jp-pixi-stop-task');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stopCurrentTask());
    }

    // Clear output button
    const clearBtn = this.contentDiv.querySelector('#jp-pixi-clear-output');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearTaskOutput());
    }

    // Back button
    const backBtn = this.contentDiv.querySelector('#jp-pixi-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.loadProjectInfo());
    }
  }

  private async runTask(taskName: string): Promise<void> {
    const outputDiv = this.contentDiv.querySelector('#jp-pixi-task-output');
    const controlsDiv = this.contentDiv.querySelector('#jp-pixi-task-controls');
    
    if (outputDiv) {
      outputDiv.innerHTML = '<div class="jp-pixi-output-line">Starting task: ' + taskName + '</div>';
      controlsDiv?.setAttribute('style', 'display: flex; gap: 10px;');
    }

    // Simulate task execution with real-time output
    try {
      await this.pixiService.executeTask(taskName, (output: string) => {
        this.appendTaskOutput(output);
      });
      this.appendTaskOutput('Task completed successfully.');
    } catch (error) {
      this.appendTaskOutput('Task failed: ' + error);
    }
  }

  private appendTaskOutput(output: string): void {
    const outputDiv = this.contentDiv.querySelector('#jp-pixi-task-output');
    if (outputDiv) {
      const outputLine = document.createElement('div');
      outputLine.className = 'jp-pixi-output-line';
      outputLine.textContent = output;
      outputDiv.appendChild(outputLine);
      outputDiv.scrollTop = outputDiv.scrollHeight;
    }
  }

  private async stopCurrentTask(): Promise<void> {
    await this.pixiService.stopCurrentTask();
    this.appendTaskOutput('Task stopped by user.');
  }

  private clearTaskOutput(): void {
    const outputDiv = this.contentDiv.querySelector('#jp-pixi-task-output');
    if (outputDiv) {
      outputDiv.innerHTML = '<div class="jp-pixi-output-placeholder">Output cleared.</div>';
    }
  }
} 