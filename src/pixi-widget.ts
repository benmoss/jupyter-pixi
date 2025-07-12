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

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshProject());
    }
    if (environmentsBtn) {
      environmentsBtn.addEventListener('click', () => this.showEnvironments());
    }
    if (packagesBtn) {
      packagesBtn.addEventListener('click', () => this.showPackages());
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
    // TODO: Implement environment management UI
    console.log('Show environments');
  }

  public showPackages(): void {
    this.renderPackageManager();
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
} 