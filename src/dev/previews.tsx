import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import MEFrp from "../../pages";
import ServiceNotFoundPage from "../../pages/ServiceNotFound";
import Login from "../../pages/auth/login";
import Forgot from "../../pages/auth/forgot";
import SignUp from "../../pages/auth/register";
import UserProfileCard from "../../pages/console/home";
import SignPage from "../../pages/console/user/sign";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/MEFrp">
                <MEFrp/>
            </ComponentPreview>
            <ComponentPreview path="/ServiceNotFoundPage">
                <ServiceNotFoundPage/>
            </ComponentPreview>
            <ComponentPreview path="/Login">
                <Login/>
            </ComponentPreview>
            <ComponentPreview path="/Forgot">
                <Forgot/>
            </ComponentPreview>
            <ComponentPreview path="/SignUp">
                <SignUp/>
            </ComponentPreview>
            <ComponentPreview path="/UserProfileCard">
                <UserProfileCard/>
            </ComponentPreview>
            <ComponentPreview path="/SignPage">
                <SignPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;