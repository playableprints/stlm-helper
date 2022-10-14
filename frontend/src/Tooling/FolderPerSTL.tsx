import ToolPanel from "../Components/ToolPanel";
import { Explode } from "../../wailsjs/go/folderexploder/Exploder";
import BigRedButton from "../Components/BigRedButton";
import { PickDirectory } from "../../wailsjs/go/main/App";

const FolderPerSTL = () => {
    return (
        <ToolPanel title="Folder per STL">
            <BigRedButton
                onClick={() => {
                    PickDirectory().then((dirPicked) => {
                        if (dirPicked) {
                            Explode(dirPicked);
                        }
                    });
                }}
            >
                Pick Folder
            </BigRedButton>
        </ToolPanel>
    );
};

export default FolderPerSTL;
