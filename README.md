# stlm-helper

Codename "Euler" (pronounced Oil-er), this application is a grab-bag of functions that didn't quite fit into the 3D model organiser [Orynt3D](www.orynt3d.com).

## Functions

### Filesystem tools

 * Explode files to folders

Takes a folder of files, creates subfolders based on the filenames, and relocates the files into the subfolders. Optionally configurable via regex.

Eg:

```
/3dfiles
    /animal.stl
    /bicycle.stl
    /car.stl
```

Can be converted to:

```
/3dfiles
    /animal
        /animal.stl
    /bicycle
        /bicycle.stl
    /car
        /car.stl
```

 * Hoist files

 Takes a folder of files and subfolders, and relocates all files in all subfolders to the top-level folder. Optionally removes empty directories and renames file names to include folder names.

Eg:

```
/3dfiles
    /animal
        /animal.stl
    /bicycle
        /bicycle.stl
    /car
        /car.stl
```

Can be converted to:

```
/3dfiles
    /animal.stl
    /bicycle.stl
    /car.stl
```

### Orynt3D taxonomy tools

 * Migrate manifests

Manually upgrade Orynt3D manifest files (`user.json` and `orynt3d.config`) to their latest version.

 * Bulk tag replacement

Read a directory that contains manifest files, and rename the selected tags in place. The exact rename method is controlled via regex.

 * Rename attribute keys

Read a directory that contains manifest files, and rename the selected attribute keys in place. The exact rename method is controlled via regex.

 * Tag to attribute

Read a directory that contains manifest files, and convert tags to attributes, separated by a specified delimiter.

### 3D file

 * Convert STL to 3MF

Read a directory that contains STL files and convert to 3MF files.

 * STL integrity tester

Read a directory that contains STL files and check them for integrity issues, such as inverted normals, duplicated edges and so on.

## Technical resources

To get started developing on stlm-helper, check out the [development guide](doc/Development.md).

-   https://go.dev
-   https://nodejs.org/
-   https://reactjs.org
-   https://www.typescriptlang.org

Additional Go-related notes are included in the [golang notes](doc/Golang.md).
