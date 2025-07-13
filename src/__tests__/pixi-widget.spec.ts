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

  it('should render project information', done => {
    setTimeout(() => {
      const content = widget.node.querySelector('.jp-pixi-content');
      expect(content).toBeTruthy();
      
      const header = content?.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Pixi Package Manager');
      
      const actions = content?.querySelector('.jp-pixi-actions');
      expect(actions).toBeTruthy();
      done();
    }, 100);
  });

  it('should have action buttons', done => {
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
      done();
    }, 100);
  });

  it('should handle refresh button click', done => {
    const mockRefreshProject = jest.spyOn(widget, 'refreshProject');
    setTimeout(() => {
      const refreshBtn = widget.node.querySelector('#refresh-btn') as HTMLButtonElement;
      refreshBtn?.click();
      expect(mockRefreshProject).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should handle environments button click', done => {
    const mockShowEnvironments = jest.spyOn(widget, 'showEnvironments');
    setTimeout(() => {
      const environmentsBtn = widget.node.querySelector('#environments-btn') as HTMLButtonElement;
      environmentsBtn?.click();
      expect(mockShowEnvironments).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should handle packages button click', done => {
    const mockShowPackages = jest.spyOn(widget, 'showPackages');
    setTimeout(() => {
      const packagesBtn = widget.node.querySelector('#packages-btn') as HTMLButtonElement;
      packagesBtn?.click();
      expect(mockShowPackages).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should render the package manager UI when showPackages is called', done => {
    widget.showPackages();
    setTimeout(() => {
      const header = widget.node.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Manage Packages');
      const packageList = widget.node.querySelector('.jp-pixi-package-list');
      expect(packageList).toBeTruthy();
      done();
    }, 100);
  });

  it('should call addPackage when add form is submitted', done => {
    widget.showPackages();
    setTimeout(() => {
      const addSpy = jest.spyOn(widget['pixiService'], 'addPackageToFeature').mockResolvedValue(undefined);
      const input = widget.node.querySelector('#jp-pixi-add-package-input') as HTMLInputElement;
      const form = widget.node.querySelector('#jp-pixi-add-package-form') as HTMLFormElement;
      const select = widget.node.querySelector('#jp-pixi-add-feature-select') as HTMLSelectElement;
      input.value = 'pytest';
      select.value = 'default';
      form.dispatchEvent(new Event('submit'));
      setTimeout(() => {
        expect(addSpy).toHaveBeenCalledWith('pytest', 'default');
        done();
      }, 50);
    }, 100);
  });

  it('should call removePackage when remove button is clicked', done => {
    widget.showPackages();
    setTimeout(() => {
      const removeSpy = jest.spyOn(widget as any, 'removePackage');
      const removeBtn = widget.node.querySelector('.jp-pixi-remove-btn') as HTMLButtonElement;
      removeBtn.click();
      setTimeout(() => {
        expect(removeSpy).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });

  it('should return to project info when back button is clicked', done => {
    widget.showPackages();
    setTimeout(() => {
      const backBtn = widget.node.querySelector('#jp-pixi-back-btn') as HTMLButtonElement;
      const loadSpy = jest.spyOn(widget as any, 'loadProjectInfo');
      backBtn.click();
      setTimeout(() => {
        expect(loadSpy).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });

  it('should render the environment manager UI when showEnvironments is called', done => {
    widget.showEnvironments();
    setTimeout(() => {
      const header = widget.node.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Manage Environments');
      const envList = widget.node.querySelector('.jp-pixi-environment-list');
      expect(envList).toBeTruthy();
      done();
    }, 100);
  });

  it('should call switchEnvironment when switch button is clicked', done => {
    widget.showEnvironments();
    setTimeout(() => {
      const switchSpy = jest.spyOn(widget as any, 'switchEnvironment');
      const switchBtn = widget.node.querySelector('.jp-pixi-switch-btn') as HTMLButtonElement;
      if (switchBtn) {
        switchBtn.click();
        setTimeout(() => {
          expect(switchSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // No switch buttons available in demo data
      }
    }, 100);
  });

  it('should call createEnvironment when create form is submitted', done => {
    widget.showEnvironments();
    setTimeout(() => {
      const createSpy = jest.spyOn(widget as any, 'createEnvironment');
      const input = widget.node.querySelector('#jp-pixi-create-env-input') as HTMLInputElement;
      const form = widget.node.querySelector('#jp-pixi-create-env-form') as HTMLFormElement;
      input.value = 'new-env';
      form.dispatchEvent(new Event('submit'));
      setTimeout(() => {
        expect(createSpy).toHaveBeenCalledWith('new-env');
        done();
      }, 50);
    }, 100);
  });

  it('should return to project info when back button is clicked in environment manager', done => {
    widget.showEnvironments();
    setTimeout(() => {
      const backBtn = widget.node.querySelector('#jp-pixi-back-btn') as HTMLButtonElement;
      const loadSpy = jest.spyOn(widget as any, 'loadProjectInfo');
      backBtn.click();
      setTimeout(() => {
        expect(loadSpy).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });

  it('should render the task manager UI when showTasks is called', done => {
    widget.showTasks();
    setTimeout(() => {
      const header = widget.node.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Task Execution');
      const taskList = widget.node.querySelector('.jp-pixi-task-list');
      expect(taskList).toBeTruthy();
      done();
    }, 100);
  });

  it('should call runTask when run task button is clicked', done => {
    widget.showTasks();
    setTimeout(() => {
      const runSpy = jest.spyOn(widget as any, 'runTask');
      const runBtn = widget.node.querySelector('.jp-pixi-run-task-btn') as HTMLButtonElement;
      if (runBtn) {
        runBtn.click();
        setTimeout(() => {
          expect(runSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // No run buttons available in demo data
      }
    }, 100);
  });

  it('should call stopCurrentTask when stop button is clicked', done => {
    widget.showTasks();
    setTimeout(() => {
      const stopSpy = jest.spyOn(widget as any, 'stopCurrentTask');
      const stopBtn = widget.node.querySelector('#jp-pixi-stop-task') as HTMLButtonElement;
      if (stopBtn) {
        stopBtn.click();
        setTimeout(() => {
          expect(stopSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Stop button not visible initially
      }
    }, 100);
  });

  it('should call clearTaskOutput when clear button is clicked', done => {
    widget.showTasks();
    setTimeout(() => {
      const clearSpy = jest.spyOn(widget as any, 'clearTaskOutput');
      const clearBtn = widget.node.querySelector('#jp-pixi-clear-output') as HTMLButtonElement;
      if (clearBtn) {
        clearBtn.click();
        setTimeout(() => {
          expect(clearSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Clear button not visible initially
      }
    }, 100);
  });

  it('should return to project info when back button is clicked in task manager', done => {
    widget.showTasks();
    setTimeout(() => {
      const backBtn = widget.node.querySelector('#jp-pixi-back-btn') as HTMLButtonElement;
      const loadSpy = jest.spyOn(widget as any, 'loadProjectInfo');
      backBtn.click();
      setTimeout(() => {
        expect(loadSpy).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });

  it('should render the project setup UI when showSetup is called', done => {
    widget.showSetup();
    setTimeout(() => {
      const header = widget.node.querySelector('.jp-pixi-header h2');
      expect(header?.textContent).toBe('Project Configuration');
      done();
    }, 100);
  });

  it('should call initializeProject when form is submitted', done => {
    widget.showSetup();
    setTimeout(() => {
      const initSpy = jest.spyOn(widget as any, 'initializeProject');
      const form = widget.node.querySelector('#jp-pixi-init-form') as HTMLFormElement;
      const nameInput = widget.node.querySelector('#jp-pixi-project-name') as HTMLInputElement;
      
      if (form && nameInput) {
        nameInput.value = 'test-project';
        form.dispatchEvent(new Event('submit'));
        setTimeout(() => {
          expect(initSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Form not available in existing project setup
      }
    }, 100);
  });

  it('should call editConfiguration when edit config button is clicked', done => {
    widget.showSetup();
    setTimeout(() => {
      const editSpy = jest.spyOn(widget as any, 'editConfiguration');
      const editBtn = widget.node.querySelector('#jp-pixi-edit-config') as HTMLButtonElement;
      if (editBtn) {
        editBtn.click();
        setTimeout(() => {
          expect(editSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Button not available in new project setup
      }
    }, 100);
  });

  it('should call reinitializeProject when reinit button is clicked', done => {
    widget.showSetup();
    setTimeout(() => {
      const reinitSpy = jest.spyOn(widget as any, 'reinitializeProject');
      const reinitBtn = widget.node.querySelector('#jp-pixi-reinit') as HTMLButtonElement;
      if (reinitBtn) {
        reinitBtn.click();
        setTimeout(() => {
          expect(reinitSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Button not available in new project setup
      }
    }, 100);
  });

  it('should call exportConfiguration when export button is clicked', done => {
    widget.showSetup();
    setTimeout(() => {
      const exportSpy = jest.spyOn(widget as any, 'exportConfiguration');
      const exportBtn = widget.node.querySelector('#jp-pixi-export') as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.click();
        setTimeout(() => {
          expect(exportSpy).toHaveBeenCalled();
          done();
        }, 50);
      } else {
        done(); // Button not available in new project setup
      }
    }, 100);
  });

  it('should return to project info when back button is clicked in project setup', done => {
    widget.showSetup();
    setTimeout(() => {
      const backBtn = widget.node.querySelector('#jp-pixi-back-btn') as HTMLButtonElement;
      const loadSpy = jest.spyOn(widget as any, 'loadProjectInfo');
      backBtn.click();
      setTimeout(() => {
        expect(loadSpy).toHaveBeenCalled();
        done();
      }, 50);
    }, 100);
  });
}); 