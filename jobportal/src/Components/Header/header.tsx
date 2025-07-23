import { Avatar, Burger, Button, Drawer, Indicator } from "@mantine/core";
import { IconBell, IconBriefcase, IconSettings, IconX } from "@tabler/icons-react";
import NavLinks from "./NavLinks.tsx";
import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu.tsx";
import { useSelector } from "react-redux";
import { useDisclosure } from "@mantine/hooks";


const nonRecruiterLinks = [
    { name: "Home", url: "" },
    { name: "Jobs", url: "jobs" },
    { name: "Job History", url: "jobhistory" },
];
// Define links after hooks
const recruiterLinks = [
    { name: "Companies", url: "companies" },
    { name: "Post Job", url: "jobs-Table" },
];




const Header = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const { user } = useSelector((store: any) => store.auth);
    const location = useLocation();
    const allLinks = [...nonRecruiterLinks, ...recruiterLinks];

    // Determine which links to display based on the user's role or login status
    const links = user
        ? user.role === 'employer'
            ? recruiterLinks
            : nonRecruiterLinks
        : allLinks;
    const shouldShow = !location.pathname.startsWith('/admin') &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login";
    return shouldShow ? (<div className="w-full bg-white px-6 shadow-lg text-black h-20 flex justify-between items-center font-['poppins']">
        <div className="flex gap-2 items-center text-blue-400">
            <IconBriefcase className="h-9 w-9 stroke={2.5}" />
            <div className="xs-mx:hidden text-2xl font-semibold">JobPortal</div>
        </div>
        <NavLinks />
        <div className="flex gap-2 items-center">
            {user ? <ProfileMenu /> : <Link to="/login">
                <Button variant="subtle" color="blue.4">Login</Button>
                <Link to="/signup">
                    <Button variant="light" color="blue.5">SignUp</Button>
                </Link></Link>}
            <Burger className="bs:hidden" opened={opened} onClick={open} aria-label="Toggle navigation" />
            <Drawer size="xs" opened={opened} onClose={close} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} position="right" closeButtonProps={{
                icon: <IconX size={30} />,
            }}>
                <div className="flex flex-col gap-6 items-center">
                    {links.map((link, index) => (
                        <div key={index} className="flex h-full items-center">
                            <Link className="hover:text-blue-400 text-xl"
                                to={`/${link.url}`} key={index}
                            >
                                {link.name}
                            </Link>
                        </div>
                    ))}
                </div>

            </Drawer>
        </div>
    </div>
    ) : null;

}
export default Header;