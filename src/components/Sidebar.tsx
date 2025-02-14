import { useState } from "react";
import Icon from "./Icon";
import { usePage } from "../hooks/Context";

interface LinkProps {
    children: React.ReactNode;
    url: string;
    newTab?: boolean;
}

function Link({ children, url, newTab }: LinkProps) {
    return (
        <a href={url} className="d-block p-2 text-white d-flex flex-row align-items-center gap-4 text-decoration-none" target={newTab ? "_blank" : "_self"}>
            {children}
        </a>
    )
}

const Sidebar: React.FC = () => {
    const { page, setPage } = usePage();
    const [open, setOpen] = useState<boolean>(false);

    const links = [
        {iconType: "home", url: "/", text: "Home", page:"Home", newTab: false},
        {iconType: "booth", url: "/booths", text: "Booths", page:"Booths", newTab: false},
        {iconType: "theme", url: "/themes", text: "Theme", page:"Themes", newTab: false},
        {iconType: "frame", url: "/frames", text: "Frames", page:"Frames", newTab: false},
        {iconType: "filter", url: "/filters", text: "Filters", page:"Filters", newTab: false},
        {iconType: "transaction", url: "https://dashboard.midtrans.com/login", text: "Transactions", page:"Transactions", newTab: true},
    ]
    
    return (
        <>
            <ul className="nav nav-pills flex-column mb-auto gap-3 px-4 py-4">
                <li className="nav-item d-flex justify-content-start align-items-center p-2" style={{ transition: 'margin-left 0.75s', marginLeft: open ? 'auto' : '0' }}>
                    <button className={`position-relative flex-row btn btn-link text-white fs-4 position-relative`} onClick={() => setOpen(!open)}>
                        <Icon type="menu" style={{transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s'}} />
                    </button>
                </li>
                {links.map((link, index) => (
                    <li key={index} className={`nav-item d-flex justify-content-start align-items-center gap-3 rounded-2 p-2
                    ${ link.page === page? "bg-tertiary" : ""}`}>
                        <Link url={link.url} newTab={link.newTab}>
                            <Icon type={link.iconType} className={ link.page === page? "text-white fw-bold" : "text-secondary" }/>
                            {open && <span className={`fs-4 ${link.page === page? "fw-bold text-white" : ""}`}>{link.text}</span>}
                        </Link>  
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Sidebar;