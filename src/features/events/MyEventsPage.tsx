import {EventsToolBar} from "../../components/EventsToolbar.tsx";
import {type ReactNode, useState} from "react";
import type {AllEventsQueryParams} from "../../types/QueryParams.ts";
import classNames from "classnames";
import "./MyEventsPage.css";

export const MyEventsPage = () => {

    type Tabs = "Participating" | "Organizing";

        const [activeTab, setActiveTab] = useState<Tabs>("Participating");
        // handle params queries properly
        const [_params, setParams] = useState<AllEventsQueryParams>({page: 1});
        const [_page, setPage] = useState<number>(1);

        /*const {
            isLoading,
            //isFetching,
            isError,
            error,
            //isSuccess
        } = useGetUsersQuery(params);*/

        //const users = useAppSelector(selectAllUsers(params));
        //const totalUsers = useAppSelector(selectUsersTotalCount(params));

        const TabsNode: ReactNode = (
            <nav className="events-nav">
                <span
                    className={classNames('nav-tab', { 'active': activeTab === 'Participating' })}
                    onClick={() => {
                        setPage(1);
                        setParams({
                            page: 1,
                        });
                        setActiveTab('Participating');
                    }}
                >
                    Participating
            </span>
                <span
                    className={classNames('nav-tab', { 'active': activeTab === 'Organizing' })}
                    onClick={() => {
                        setPage(1);
                        setParams({
                            page: 1,
                        });
                        setActiveTab('Organizing');
                    }}
                >
                    Organizing
            </span>
            </nav>
        );

        //if (isLoading) return <CircularProgress />;
        /*if (isError) {
            console.error(error);
            return <div>Error Loading Users...</div>;
        }*/

        /*return (
            <div className="page-container">
                <h1 className="page-title">Users</h1>
                {/!*<UsersTable  users={users} isExperts={isExperts} isLearners={isLearners} />
                <TablePagination
                    component="div"
                    count={totalUsers}
                    onPageChange={(_, newPage) => {
                        setPage(newPage);
                        setParams((prev) => ({
                            ...prev,
                            page: newPage + 1,
                        }))
                    }}
                    page={page}
                    rowsPerPage={4}
                    rowsPerPageOptions={[4]}
                />*!/}
            </div>
        );
    };*/

    return (
        <div className="page-content">
            <EventsToolBar listTitle="My Events"/>
            {TabsNode}
            <div className="page-container">
            </div>
        </div>
    );
};