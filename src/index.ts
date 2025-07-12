import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { PixiWidget } from './pixi-widget';

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

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = () => {
      // Create a PixiWidget inside of a MainAreaWidget
      const content = new PixiWidget();
      const widget = new MainAreaWidget({ content });
      widget.id = 'pixi-jupyterlab';
      widget.title.label = 'Pixi Package Manager';
      widget.title.closable = true;
      return widget;
    };
    let widget = newWidget();

    // Add an application command
    const command: string = 'pixi:open';
    app.commands.addCommand(command, {
      label: 'Open Pixi Package Manager',
      execute: () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Pixi' });
  }
};

export default plugin;
