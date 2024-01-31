import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import MEFrp from "../../pages";
import ServiceNotFoundPage from "../../pages/ServiceNotFound";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/MEFrp">
                <MEFrp/>
            </ComponentPreview>
            <ComponentPreview path="/ServiceNotFoundPage">
                <ServiceNotFoundPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;