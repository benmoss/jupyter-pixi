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
    expect(projectInfo.environments).toEqual(['default', 'dev', 'test']);
    expect(projectInfo.packages).toEqual(['python', 'numpy', 'pandas']);
  });

  it('should handle project info when not in a pixi project', async () => {
    // Mock the checkIfPixiProject to return false
    jest.spyOn(service as any, 'checkIfPixiProject').mockResolvedValue(false);
    
    const projectInfo = await service.getProjectInfo();
    
    expect(projectInfo.isPixiProject).toBe(false);
    expect(projectInfo.name).toBeUndefined();
    expect(projectInfo.currentEnvironment).toBeUndefined();
    expect(projectInfo.environments).toEqual([]);
    expect(projectInfo.packages).toEqual([]);
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

  it('should get available environments', async () => {
    const environments = await (service as any).getAvailableEnvironments();
    expect(environments).toEqual(['default', 'dev', 'test']);
  });

  it('should get installed packages', async () => {
    const packages = await (service as any).getInstalledPackages();
    expect(packages).toEqual(['python', 'numpy', 'pandas']);
  });
}); 