# Updating the Downloads page

The downloads page is driven by the `/_data/pages/es/downloads.yml` file. Most of the content of the page is located in the yaml file while the `/_layouts/downloads.html` contains the template. 

Most of the updates can be achieved by doing a search for the previous release version and replacing it with the current version below is a more exhaustive and explicit list of the locations of the changes that need to be made.

## Artifacts

Because the `downloads.yml` is coupled somewhat with the structure, there is no central place with each artifact. The path to key artifacts are as follows:

* Release Notes: `misc.release_notes`
* Data Prepper
    - x64 / linux: `dataprepper.arch[0].platforms.linux.parts.linux.artifacts.zip.uri`
    - x64 / macos: `dataprepper.arch[0].platforms.macos.parts.macos.artifacts.zip.uri`
* JDBC: `drivers.arch[0].platforms.java.parts.java.artifacts.jar.uri` and `drivers.arch[1].platforms.java.parts.java.artifacts.jar.uri` (note, due to a JDBC being architecture independent, design dictated that it be listed in both x86 and x64 and thus requires updating in two places)
* ODBC:
    - x64 / windows: `drivers.arch[0].platforms.windows.parts.windows.artifacts.msi`
    - x64 / macos: `drivers.arch[0].platforms.macos.parts.macOS.artifacts.pkg`
    - x86 / windows: `drivers.arch[1].platforms.windows.parts.windows.artifacts.msi`
* perftop:
    - x64 / linux: `perftop.arch[0].platforms.linux.parts.linux.artifacts.zip`
    - x64 / macos: `perftop.arch[0].platforms.macos.parts.macos.artifacts.msi` (_this should be cleaned up `msi` is a misnomer, it is a `.zip`)
* Elasticsearch
    - x64 / windows / exe installer : `develop.arch[0].platforms.windows.parts.elasticsearch.artifacts.exe.uri`
    - x64 / windows / zip : `develop.arch[0].platforms.windows.parts.elasticsearch.artifacts.zip.uri`
    - x64 / linux / tar.gz : `develop.arch[0].platforms.linux.parts.elasticsearch.artifacts.targz.uri`
     - x64 / linux / tar.gz / sha: `develop.arch[0].platforms.linux.parts.elasticsearch.artifacts.targz.subs[0].uri`
* Kibana
    - x64 / windows / exe installer: `develop.arch[0].platforms.windows.parts.kibana.artifacts.exe.uri`
    - x64 / windows / zip: `develop.arch[0].platforms.windows.parts.kibana.artifacts.zip.uri`
    - x64 / linux / tar.gz: `develop.arch[0].platforms.linux.parts.kibana.artifacts.targz.uri`
    - x64 / linux / tar.gz / sha: `develop.arch[0].platforms.linux.parts.kibana.artifacts.targz.subs[0].uri`

## Other updates:

* Change the version: `version.odfe`
* Change the release date: `lastreleasedate`
* Update the URI of the release notes: `misc.release_notes`
* Update the versions Elasticsearch, Kibana and the plugins: `included.components[...].subcomponents[...].version`
* Update the artifact list: `alldownloads.downloadlist`




