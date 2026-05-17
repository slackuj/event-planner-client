import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Avatar} from "@mui/material";
import type {AllEventsResponse} from "../types/event.ts";
import "./EventsTable.css";
import {useAppDispatch} from "../hooks/storeHooks.ts";
import {toggleEventModal} from "../store/slices/modalsSlice.ts";

interface EventsTableProps {
    events: AllEventsResponse[];
}

export const EventsTable = (props: EventsTableProps) => {

    const { events } = props;
    const dispatch = useAppDispatch();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell align="right">Event Date</TableCell>
                        <TableCell align="right">Organizer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        events.length === 0 ?
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                                    No Events Found...
                                </TableCell>
                            </TableRow>
                            :
                    events.map((event) => (
                        <TableRow
                            key={event.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell><span onClick={() => dispatch(toggleEventModal({focusedEventId: event.id, focusedEventsOrganizersEmail: event.organizer_email}))}>{event.title}</span></TableCell>
                            <TableCell align="right">{new Date(event.event_date).toDateString()}</TableCell>
                            <TableCell align="right">
                                <span className="organizer-avatar"><Avatar alt="" src={event.organizer_profile_picture} /> {event.organizer_email}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};