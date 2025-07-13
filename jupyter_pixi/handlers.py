import json
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
import subprocess

class PixiAddPackageHandler(APIHandler):
    @tornado.web.authenticated
    async def post(self):
        data = self.get_json_body()
        package = data.get('package')
        feature = data.get('feature')
        if not package or not feature:
            self.set_status(400)
            self.finish(json.dumps({'error': 'Missing package or feature'}))
            return
        try:
            # Run the Pixi CLI to add the package to the feature
            result = subprocess.run([
                'pixi', 'add', package, '--feature', feature
            ], capture_output=True, text=True)
            if result.returncode == 0:
                self.finish(json.dumps({'success': True, 'output': result.stdout}))
            else:
                self.set_status(500)
                self.finish(json.dumps({'success': False, 'error': result.stderr}))
        except Exception as e:
            self.set_status(500)
            self.finish(json.dumps({'success': False, 'error': str(e)}))

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    handlers = []
    for route in ["add-package"]:
        route_pattern = url_path_join(base_url, "jupyter-pixi", route)
        handlers += [(route_pattern, PixiAddPackageHandler)]
    web_app.add_handlers(host_pattern, handlers)
