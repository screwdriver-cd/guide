# creates a python virtual environment, installs the dependencies, & serves the guide locally
local: venv
	. venv/bin/activate; mkdocs serve

# creates a python virtual environment & installs the dependencies
venv: requirements.txt
	test -d venv || virtualenv venv
	. venv/bin/activate; pip install -Ur requirements.txt
	touch venv/bin/activate

# cleans all the compiled python files
clean:
	find . -name "*.pyc" -exec rm -rf {} \;
	rm -rf ./venv/
