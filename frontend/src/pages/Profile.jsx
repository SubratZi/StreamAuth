import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Profile(){
    const {user, loading} = useAuth();

    if(loading){
        return(
            <div style={styles.container}>
                <h2 style={{color: "white"}}>Loading...</h2>
            </div>
        );
    }

    if(!user){
        return(
            <div style={styles.container}>
                <h2 style={{color: "white"}}>Not Logged In</h2>
            </div>
        );
    }
    return(
        <div style={styles.page}>
            <Navbar/>
            <div style={styles.content}>
                <h1 style={styles.heading}>Profile</h1>
                <div style={styles.card}>
                    <div style={styles.row}>
                        <span>Username</span>
                        <strong>{user.username}</strong>
                    </div>
                    <div style={styles.row}>
                        <span>Email</span>
                        <strong>{user.email}</strong>
                    </div>
                    <div style={styles.row}>
                        <span>Role</span>
                        <strong>{user.roles}</strong>
                    </div>
                    <div style={styles.row}>
                        <span>Paid_User:</span>
                        <strong>{user.is_paid ? "Yes 👑": "No 👤"}</strong>
                    </div>
                    <div style={styles.row}>
                        <span>User ID</span>
                        <strong>{user.user_id}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
    },

    content: {
        padding: "40px",
    },

    heading: {
        marginBottom: "20px",
    },

    card: {
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        width: "400px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
        color: "#cbd5e1",
    },

    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
    },
};
