import {algod, computeTransactionId} from "../api.ts";
import React, {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useTxnLookup} from "../store.ts";

import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    IconButton,
    Link, Popover, styled, Tooltip, tooltipClasses, TooltipProps, Typography
} from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
import {usePendingTxn} from "../hooks/usePendingTxn.ts";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
export function PaymentTxnCell({txn}){
    const {id, round, confirmed, failed} = txn
    return (
        <div>
            {id}-{round}-{confirmed}-{failed}
        </div>
    )
}

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});
export function PendingTxnCell({type, id, round, status, heartbeat, startedAt, finishedAt, confirmed, failed, ratelimit}){
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    usePendingTxn({id, round, status, heartbeat, startedAt, finishedAt, confirmed, failed}, heartbeat, ratelimit)
    const backgroundColor = status === 'confirmed' ? 'green' : status === 'failed' ? 'red' : undefined
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <NoMaxWidthTooltip title={id} arrow>
        <Card>
            <CardHeader title={round} subheader={type} sx={{backgroundColor}}/>
            {/*<CardContent>*/}
            {/*    <p>Started: {new Date(startedAt).toLocaleTimeString()}</p>*/}
            {/*    <p>Finished: {finishedAt ? new Date(finishedAt).toLocaleTimeString() : status}</p>*/}
            {/*    <p>Confirmed: {confirmed}</p>*/}
            {/*</CardContent>*/}
            <CardActions>
                {status === 'unknown' && <CircularProgress size={38}/>}
                {status === 'failed' && <IconButton disabled><ErrorIcon color="error"/></IconButton>}
                {status === 'confirmed' && <IconButton disabled sx={{marginRight: 'auto'}}><DoneIcon  color="success"/></IconButton>}

                {status === 'confirmed' &&  <Link sx={{ marginLeft: 'auto'}} as={IconButton} href={`https://explorer.perawallet.app/tx/${id}/`} target="_blank"><LaunchIcon/></Link>}
            </CardActions>
        </Card>
        </NoMaxWidthTooltip>
    )
}
