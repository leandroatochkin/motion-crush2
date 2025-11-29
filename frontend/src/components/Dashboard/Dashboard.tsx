import React, {useState} from 'react'
// import SidebarToggle from '../ui/SidebarToggle';
// import Sidebar from '../ui/Sidebar';
// import DarkModeToggle from '../ui/DarkModeToggle';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store'
import { ToastContainer } from 'react-toastify';



interface DashboardProps {
    children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({children}) => {
const [openSidebar, setOpenSidebar] = useState<boolean>(false);  

const theme = useSelector((state: RootState) => state.theme);

const bgSec = theme.colors.backgroundSecondary

  return (
    <>
    {/* <Sidebar open={openSidebar} setOpen={setOpenSidebar}/> */}
    <div
    style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 16,
    }}
    >
        {/* <DarkModeToggle />
        <SidebarToggle open={openSidebar} setOpen={setOpenSidebar} /> */}
    </div>
    <div
    style={{
        position: 'absolute',
        top: '0',
        left: '0',
        minHeight: '100dvh',
        width: '100vw',
        // backgroundColor: theme.colors.background,
        // backgroundImage: `linear-gradient(0deg, transparent 24%, ${bgSec} 25%, ${bgSec} 26%, transparent 27%,transparent 74%, ${bgSec} 75%, ${bgSec} 76%, transparent 77%,transparent),
        // linear-gradient(90deg, transparent 24%, ${bgSec} 25%, ${bgSec} 26%, transparent 27%,transparent 74%, ${bgSec} 75%, ${bgSec} 76%, transparent 77%,transparent)
        // `,
        // backgroundSize: `55px 55px`
        //background: '#833AB4',
        background: `linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)`
    }}
    >
        {children}
    </div>
    <ToastContainer />
    </>
  )
}

export default Dashboard