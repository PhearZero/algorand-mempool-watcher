import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import {Box, Fade} from "@mui/material";
import { useWallet } from "@txnlab/use-wallet";

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};
export function ConnectWallet(){
    const [open, setOpen] = useState(false);
    const {providers, activeAddress} = useWallet()
    const handleOpen = () => {
        console.log('Open')
        setOpen(true)
    }

    return (
        <>
            <Button onClick={handleOpen}>Connect</Button>
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Box sx={{
                            position: "relative"
                        }}>
                            {activeAddress}
                            {providers && providers.map((item)=>{
                                return (
                                    <Box key={item.metadata.id}>
                                        <img height={55} width={55} src={item.metadata.icon} alt={item.metadata.name} />
                                        <Button onClick={()=>item.connect()}>Connect</Button>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
