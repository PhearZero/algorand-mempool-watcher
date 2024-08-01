import {
    Card,
    CardActions,
    CardHeader,
    CircularProgress,
    IconButton,
    Link,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps
} from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
import {usePendingTxn} from "../hooks/usePendingTxn.ts";

import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';

const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});
export type PendingTxnCellProps = {
    type?: string,
    id: string,
    round: number,
    status: string,
    heartbeat: number,
    startedAt?: number,
    finishedAt?: number,
    confirmed?: number,
    failed?: string,
    ratelimit?: boolean
}
export function PendingTxnCell({type, id, round, status, heartbeat, startedAt, finishedAt, confirmed, failed, ratelimit}: PendingTxnCellProps){
    usePendingTxn({id, round, status, heartbeat, startedAt, finishedAt, confirmed, failed}, heartbeat, ratelimit)
    const backgroundColor = status === 'confirmed' ? 'green' : status === 'failed' ? 'red' : undefined

    //@ts-expect-error, shhh behave
    const LinkComponent = ()=><Link sx={{ marginLeft: 'auto'}} as={IconButton} href={`https://explorer.perawallet.app/tx/${id}/`} target="_blank"><LaunchIcon/></Link>

    return (
        <NoMaxWidthTooltip title={id} arrow>
        <Card>
            <CardHeader title={round} subheader={type} sx={{backgroundColor}}/>
            <CardActions>
                {status === 'unknown' && <CircularProgress size={38}/>}
                {status === 'failed' && <IconButton disabled><ErrorIcon color="error"/></IconButton>}
                {status === 'confirmed' && <IconButton disabled sx={{marginRight: 'auto'}}><DoneIcon  color="success"/></IconButton>}

                {status === 'confirmed' &&  <LinkComponent/>}
            </CardActions>
        </Card>
        </NoMaxWidthTooltip>
    )
}
