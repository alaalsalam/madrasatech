from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in madrasatech/__init__.py
from madrasatech import __version__ as version

setup(
	name="madrasatech",
	version=version,
	description="an erp system",
	author="samia",
	author_email="a@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
