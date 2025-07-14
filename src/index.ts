import { ICommandPalette } from '@jupyterlab/apputils';
import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { PixiWidget } from './pixi-widget';
import { LabIcon } from '@jupyterlab/ui-components';
// @ts-ignore
import packageSvg from '../style/package.svg';

const packageLabIcon = new LabIcon({
  name: 'pixi:package',
  svgstr: packageSvg
});

/**
 * Initialization data for the jupyter-pixi extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-pixi',
  description: 'A JupyterLab extension for managing pixi projects and environments.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyter-pixi is activated!');

    // Create the PixiWidget and add it to the left sidebar
    const widget = new PixiWidget();
    widget.id = 'pixi-jupyterlab';
    widget.title.caption = 'Pixi Package Manager';
    widget.title.icon = packageLabIcon;
    widget.title.closable = true;
    app.shell.add(widget, 'left');

    // Add an application command to activate the sidebar widget
    const command: string = 'pixi:open';
    app.commands.addCommand(command, {
      label: 'Open Pixi Package Manager',
      execute: () => {
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Pixi' });
  }
};

export default plugin;
