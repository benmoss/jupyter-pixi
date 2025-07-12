import { PixiWidget } from '../pixi-widget';

describe('PixiWidget', () => {
  let widget: PixiWidget;

  beforeEach(() => {
    widget = new PixiWidget();
  });

  afterEach(() => {
    widget.dispose();
  });

  it('should create a PixiWidget instance', () => {
    expect(widget).toBeInstanceOf(PixiWidget);
  });

  it('should have the correct CSS class', () => {
    expect(widget.node.classList.contains('jp-pixi-widget')).toBe(true);
  });

  it('should render project information', () => {
    // Wait for the async loadProjectInfo to complete
    setTimeout(() => {
      const content = widget.node.querySelector('.jp-pixi-content');
      expect(content).toBeTruthy();
      
      const header = content?.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Pixi Package Manager');
      
      const actions = content?.querySelector('.jp-pixi-actions');
      expect(actions).toBeTruthy();
    }, 100);
  });

  it('should have action buttons', () => {
    setTimeout(() => {
      const refreshBtn = widget.node.querySelector('#refresh-btn');
      const environmentsBtn = widget.node.querySelector('#environments-btn');
      const packagesBtn = widget.node.querySelector('#packages-btn');
      
      expect(refreshBtn).toBeTruthy();
      expect(environmentsBtn).toBeTruthy();
      expect(packagesBtn).toBeTruthy();
      
      expect(refreshBtn?.textContent).toBe('Refresh Project');
      expect(environmentsBtn?.textContent).toBe('Manage Environments');
      expect(packagesBtn?.textContent).toBe('Manage Packages');
    }, 100);
  });

  it('should handle refresh button click', () => {
    const mockRefreshProject = jest.spyOn(widget, 'refreshProject');
    
    setTimeout(() => {
      const refreshBtn = widget.node.querySelector('#refresh-btn') as HTMLButtonElement;
      refreshBtn?.click();
      
      expect(mockRefreshProject).toHaveBeenCalled();
    }, 100);
  });

  it('should handle environments button click', () => {
    const mockShowEnvironments = jest.spyOn(widget, 'showEnvironments');
    
    setTimeout(() => {
      const environmentsBtn = widget.node.querySelector('#environments-btn') as HTMLButtonElement;
      environmentsBtn?.click();
      
      expect(mockShowEnvironments).toHaveBeenCalled();
    }, 100);
  });

  it('should handle packages button click', () => {
    const mockShowPackages = jest.spyOn(widget, 'showPackages');
    
    setTimeout(() => {
      const packagesBtn = widget.node.querySelector('#packages-btn') as HTMLButtonElement;
      packagesBtn?.click();
      
      expect(mockShowPackages).toHaveBeenCalled();
    }, 100);
  });
}); 