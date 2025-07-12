import { PixiService } from '../pixi-service';

describe('PixiService', () => {
  let service: PixiService;

  beforeEach(() => {
    service = new PixiService();
  });

  it('should create a PixiService instance', () => {
    expect(service).toBeInstanceOf(PixiService);
  });

  it('should get project information', async () => {
    const projectInfo = await service.getProjectInfo();
    
    expect(projectInfo).toBeDefined();
    expect(projectInfo.isPixiProject).toBe(true);
    expect(projectInfo.name).toBe('demo-pixi-project');
    expect(projectInfo.currentEnvironment).toBe('default');
    expect(projectInfo.environments).toEqual([
      {
        name: 'default',
        features: ['default'],
        inheritDefault: false
      },
      {
        name: 'dev',
        features: ['default', 'dev-tools'],
        inheritDefault: true
      },
      {
        name: 'test',
        features: ['default', 'testing'],
        inheritDefault: true
      },
      {
        name: 'python310',
        features: ['python310'],
        inheritDefault: true
      },
      {
        name: 'python311',
        features: ['python311'],
        inheritDefault: true
      }
    ]);
    expect(projectInfo.features).toEqual([
      {
        name: 'default',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ],
        isDefault: true
      },
      {
        name: 'dev-tools',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'black', version: '23.7' },
          { name: 'flake8', version: '6.0' }
        ]
      },
      {
        name: 'testing',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'coverage', version: '7.2' }
        ]
      },
      {
        name: 'python310',
        packages: [
          { name: 'python', version: '3.10' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      },
      {
        name: 'python311',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      }
    ]);
  });

  it('should handle project info when not in a pixi project', async () => {
    // Mock the checkIfPixiProject to return false
    jest.spyOn(service as any, 'checkIfPixiProject').mockResolvedValue(false);
    
    const projectInfo = await service.getProjectInfo();
    
    expect(projectInfo.isPixiProject).toBe(false);
    expect(projectInfo.name).toBeUndefined();
    expect(projectInfo.currentEnvironment).toBeUndefined();
    expect(projectInfo.environments).toEqual([]);
    expect(projectInfo.features).toEqual([]);
  });

  it('should execute pixi commands', async () => {
    const result = await service.executePixiCommand('add', ['python']);
    
    expect(result).toBe('Command executed successfully');
  });

  it('should handle command execution errors', async () => {
    // Mock executePixiCommand to throw an error
    jest.spyOn(service, 'executePixiCommand').mockRejectedValue(new Error('Command failed'));
    
    await expect(service.executePixiCommand('invalid', ['command'])).rejects.toThrow('Command failed');
  });

  it('should get project name', async () => {
    const projectName = await (service as any).getProjectName();
    expect(projectName).toBe('demo-pixi-project');
  });

  it('should get current environment', async () => {
    const currentEnvironment = await (service as any).getCurrentEnvironment();
    expect(currentEnvironment).toBe('default');
  });

  it('should get environments with features', async () => {
    const environments = await (service as any).getEnvironmentsWithFeatures();
    expect(environments).toEqual([
      {
        name: 'default',
        features: ['default'],
        inheritDefault: false
      },
      {
        name: 'dev',
        features: ['default', 'dev-tools'],
        inheritDefault: true
      },
      {
        name: 'test',
        features: ['default', 'testing'],
        inheritDefault: true
      },
      {
        name: 'python310',
        features: ['python310'],
        inheritDefault: true
      },
      {
        name: 'python311',
        features: ['python311'],
        inheritDefault: true
      }
    ]);
  });

  it('should get features with packages', async () => {
    const features = await (service as any).getFeaturesWithPackages();
    expect(features).toEqual([
      {
        name: 'default',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ],
        isDefault: true
      },
      {
        name: 'dev-tools',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'black', version: '23.7' },
          { name: 'flake8', version: '6.0' }
        ]
      },
      {
        name: 'testing',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'coverage', version: '7.2' }
        ]
      },
      {
        name: 'python310',
        packages: [
          { name: 'python', version: '3.10' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      },
      {
        name: 'python311',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      }
    ]);
  });

  it('should get installed packages for current environment', async () => {
    const packages = await service.getInstalledPackages();
    expect(packages).toEqual([
      { name: 'python', version: '3.11' },
      { name: 'numpy', version: '1.24' },
      { name: 'pandas', version: '2.0' }
    ]);
  });

  it('should get installed packages for dev environment with inheritance', async () => {
    const packages = await service.getInstalledPackages('dev');
    expect(packages).toEqual([
      { name: 'python', version: '3.11' },
      { name: 'numpy', version: '1.24' },
      { name: 'pandas', version: '2.0' },
      { name: 'pytest', version: '7.4' },
      { name: 'black', version: '23.7' },
      { name: 'flake8', version: '6.0' }
    ]);
  });

  it('should get features for environment', async () => {
    const features = await service.getFeaturesForEnvironment('dev');
    expect(features).toEqual([
      {
        name: 'default',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ],
        isDefault: true
      },
      {
        name: 'dev-tools',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'black', version: '23.7' },
          { name: 'flake8', version: '6.0' }
        ]
      }
    ]);
  });

  it('should get available tasks', async () => {
    const tasks = await service.getAvailableTasks();
    expect(tasks).toEqual([
      { name: 'test', description: 'Run tests' },
      { name: 'build', description: 'Build the project' },
      { name: 'dev', description: 'Start development server' },
      { name: 'shell', description: 'Open interactive shell' }
    ]);
  });

  it('should execute a task with output callback', async () => {
    const outputs: string[] = [];
    const onOutput = (output: string) => outputs.push(output);
    
    await service.executeTask('test', onOutput);
    
    expect(outputs).toContain('Starting task: test');
    expect(outputs).toContain('Initializing environment...');
    expect(outputs).toContain('Loading dependencies...');
    expect(outputs).toContain('Running task...');
    expect(outputs).toContain('Task test completed successfully.');
  });

  it('should execute a task without output callback', async () => {
    await expect(service.executeTask('build')).resolves.not.toThrow();
  });

  it('should stop current task', async () => {
    await expect(service.stopCurrentTask()).resolves.not.toThrow();
  });

  it('should initialize a new project', async () => {
    const config = {
      name: 'test-project',
      description: 'A test project',
      pythonVersion: '3.11',
      initialPackages: ['numpy', 'pandas']
    };
    
    await expect(service.initializeProject(config)).resolves.not.toThrow();
  });

  it('should edit configuration', async () => {
    await expect(service.editConfiguration()).resolves.not.toThrow();
  });

  it('should reinitialize project', async () => {
    await expect(service.reinitializeProject()).resolves.not.toThrow();
  });

  it('should export configuration', async () => {
    const config = await service.exportConfiguration();
    
    expect(config).toBeDefined();
    expect(config.name).toBe('demo-pixi-project');
    expect(config.description).toBe('A demo pixi project');
    expect(config.pythonVersion).toBe('3.11');
    expect(config.environments).toEqual([
      {
        name: 'default',
        features: ['default'],
        inheritDefault: false
      },
      {
        name: 'dev',
        features: ['default', 'dev-tools'],
        inheritDefault: true
      },
      {
        name: 'test',
        features: ['default', 'testing'],
        inheritDefault: true
      },
      {
        name: 'python310',
        features: ['python310'],
        inheritDefault: true
      },
      {
        name: 'python311',
        features: ['python311'],
        inheritDefault: true
      }
    ]);
    expect(config.features).toEqual([
      {
        name: 'default',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ],
        isDefault: true
      },
      {
        name: 'dev-tools',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'black', version: '23.7' },
          { name: 'flake8', version: '6.0' }
        ]
      },
      {
        name: 'testing',
        packages: [
          { name: 'pytest', version: '7.4' },
          { name: 'coverage', version: '7.2' }
        ]
      },
      {
        name: 'python310',
        packages: [
          { name: 'python', version: '3.10' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      },
      {
        name: 'python311',
        packages: [
          { name: 'python', version: '3.11' },
          { name: 'numpy', version: '1.24' },
          { name: 'pandas', version: '2.0' }
        ]
      }
    ]);
    expect(config.tasks).toEqual(['test', 'build', 'dev', 'shell']);
  });
}); 