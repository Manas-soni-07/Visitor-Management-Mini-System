import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AppDispatch, RootState } from "./store";
import { login, logout } from "./features/authSlice";
import {
  addVisitor,
  changeStatus,
  deleteVisitor,
  fetchVisitors,
} from "./features/visitorsSlice";
import type { Visitor, VisitorInput, VisitorStatus } from "./types";
import "./App.css";

const glyph = (symbol: string) => () => (
  <span aria-hidden="true" className="glyph">
    {symbol}
  </span>
);
const Add = glyph("+"),
  Apartment = glyph("⌂"),
  CheckCircleOutline = glyph("✓"),
  DeleteOutline = glyph("⌫");
const EventAvailable = glyph("✓"),
  Logout = glyph("↪"),
  Menu = glyph("☰"),
  PeopleAltOutlined = glyph("♙");
const PersonAddAlt1 = glyph("+"),
  ShieldOutlined = glyph("◈"),
  Close = glyph("×");

const dispatchHook = () => useDispatch<AppDispatch>();
const prettyDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

function LoginPage() {
  const dispatch = dispatchHook();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState("admin@haven.com");
  const [password, setPassword] = useState("visitor123");
  const [touched, setTouched] = useState(false);
  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 6;
  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand-mark">
          <Apartment />
        </div>
        <Typography variant="h3">
          A calmer way to
          <br />
          welcome guests.
        </Typography>
        <Typography>
          Everything your community needs to manage visitor access with
          confidence.
        </Typography>
        <div className="intro-card">
          <PeopleAltOutlined />
          <div>
            <strong>Simple visitor management</strong>
            <span>Keep your building secure, organized, and welcoming.</span>
          </div>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-form">
          <div className="brand-small">
            <Apartment /> Haven
          </div>
          <Typography variant="h4">Welcome back</Typography>
          <Typography className="muted">
            Sign in to access your dashboard.
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (valid) dispatch(login({ email, password }));
            }}
            noValidate
          >
            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={touched && !/\S+@\S+\.\S+/.test(email)}
              helperText={
                touched && !/\S+@\S+\.\S+/.test(email)
                  ? "Enter a valid email address"
                  : ""
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={touched && password.length < 6}
              helperText={
                touched && password.length < 6
                  ? "Password must contain at least 6 characters"
                  : "Demo password: visitor123"
              }
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Typography className="terms">
            By continuing, you agree to Haven's Terms of Service and Privacy
            Policy.
          </Typography>
        </div>
      </section>
    </main>
  );
}

function StatusChip({ status }: { status: VisitorStatus }) {
  return (
    <span className={`status ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}
function Sidebar({
  page,
  setPage,
  onClose,
}: {
  page: string;
  setPage: (p: string) => void;
  onClose?: () => void;
}) {
  const go = (p: string) => {
    setPage(p);
    onClose?.();
  };
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Apartment />
        </div>
        <span>Haven</span>
      </div>
      <div className="nav-label">MANAGEMENT</div>
      <button
        className={page === "visitors" ? "nav-active" : ""}
        onClick={() => go("visitors")}
      >
        <PeopleAltOutlined /> Visitors
      </button>
      <button
        className={page === "add" ? "nav-active" : ""}
        onClick={() => go("add")}
      >
        <PersonAddAlt1 /> Add visitor
      </button>
      <div className="sidebar-foot">
        <ShieldOutlined />
        <span>
          Secure access
          <br />
          <small>Visitor management</small>
        </span>
      </div>
    </nav>
  );
}

function VisitorList({
  onAdd,
  notify,
}: {
  onAdd: () => void;
  notify: (m: string) => void;
}) {
  const dispatch = dispatchHook();
  const { items, loading, error } = useSelector((s: RootState) => s.visitors);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Visitor | null>(null);
  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);
  const filtered = useMemo(
    () =>
      items.filter((v) =>
        `${v.name} ${v.unit} ${v.phone}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );
  const setStatus = async (id: string, status: VisitorStatus) => {
    await dispatch(changeStatus({ id, status }));
    notify(`Visitor ${status.toLowerCase()} successfully`);
  };
  return (
    <>
      <div className="page-title">
        <div>
          <Typography variant="h4">Visitors</Typography>
          <Typography className="muted">
            Manage and review all visitor requests.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Add visitor
        </Button>
      </div>
      <section className="list-card">
        <div className="list-toolbar">
          <TextField
            placeholder="Search by name, unit or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
          />
          <Typography className="count">
            {filtered.length} visitor{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <div className="loader">
            <CircularProgress />
            <span>Loading visitors...</span>
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Visit date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="visitor-name">
                        <Avatar>
                          {v.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <strong>{v.name}</strong>
                      </div>
                    </TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell>
                      <span className="unit">{v.unit}</span>
                    </TableCell>
                    <TableCell>{prettyDate(v.visitDate)}</TableCell>
                    <TableCell>
                      <StatusChip status={v.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        {v.status === "Pending" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                color="success"
                                onClick={() => setStatus(v.id, "Approved")}
                              >
                                <CheckCircleOutline />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                color="warning"
                                onClick={() => setStatus(v.id, "Rejected")}
                              >
                                <Close />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => setPendingDelete(v)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                      <Typography className="muted">
                        No visitors found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </section>
      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete visitor?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove {pendingDelete?.name}'s visitor
            request.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (pendingDelete) {
                await dispatch(deleteVisitor(pendingDelete.id));
                notify("Visitor deleted successfully");
                setPendingDelete(null);
              }
            }}
          >
            Delete visitor
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AddVisitor({
  onDone,
  notify,
}: {
  onDone: () => void;
  notify: (m: string) => void;
}) {
  const dispatch = dispatchHook();
  const saving = useSelector((s: RootState) => s.visitors.saving);
  const [data, setData] = useState<VisitorInput>({
    name: "",
    phone: "",
    unit: "",
    visitDate: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const errors = {
    name: !data.name.trim(),
    phone: !/^\+?[0-9\s-]{10,}$/.test(data.phone),
    unit: !data.unit.trim(),
    visitDate: !data.visitDate,
  };
  const change = (key: keyof VisitorInput, value: string) =>
    setData({ ...data, [key]: value });
  return (
    <>
      <div className="page-title">
        <div>
          <Typography variant="h4">Add visitor</Typography>
          <Typography className="muted">
            Create a new visitor request for your community.
          </Typography>
        </div>
      </div>
      <section className="form-card">
        <div className="form-heading">
          <div className="round-icon">
            <PersonAddAlt1 />
          </div>
          <div>
            <Typography variant="h6">Visitor details</Typography>
            <Typography className="muted">
              Fill in the information below. The request will start as pending.
            </Typography>
          </div>
        </div>
        <Box
          component="form"
          className="visitor-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitted(true);
            if (!Object.values(errors).some(Boolean)) {
              await dispatch(addVisitor(data));
              notify("Visitor added successfully");
              onDone();
            }
          }}
        >
          <TextField
            label="Full name"
            placeholder="e.g. Riya Patel"
            value={data.name}
            onChange={(e) => change("name", e.target.value)}
            error={submitted && errors.name}
            helperText={submitted && errors.name ? "Name is required" : ""}
          />
          <TextField
            label="Phone number"
            placeholder="e.g. +91 98765 43210"
            value={data.phone}
            onChange={(e) => change("phone", e.target.value)}
            error={submitted && errors.phone}
            helperText={
              submitted && errors.phone ? "Enter a valid phone number" : ""
            }
          />
          <TextField
            label="Unit number"
            placeholder="e.g. A-302"
            value={data.unit}
            onChange={(e) => change("unit", e.target.value)}
            error={submitted && errors.unit}
            helperText={
              submitted && errors.unit ? "Unit number is required" : ""
            }
          />
          <TextField
            label="Visit date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={data.visitDate}
            onChange={(e) => change("visitDate", e.target.value)}
            error={submitted && errors.visitDate}
            helperText={
              submitted && errors.visitDate ? "Visit date is required" : ""
            }
          />
          <div className="form-actions">
            <Button color="inherit" onClick={onDone}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<EventAvailable />}
              disabled={saving}
            >
              {saving ? "Adding..." : "Add visitor"}
            </Button>
          </div>
        </Box>
      </section>
    </>
  );
}

function Dashboard() {
  const dispatch = dispatchHook();
  const user = useSelector((s: RootState) => s.auth.user)!;
  const [page, setPage] = useState("visitors");
  const [drawer, setDrawer] = useState(false);
  const [notice, setNotice] = useState("");
  const content =
    page === "visitors" ? (
      <VisitorList onAdd={() => setPage("add")} notify={setNotice} />
    ) : (
      <AddVisitor onDone={() => setPage("visitors")} notify={setNotice} />
    );
  return (
    <div className="dashboard">
      <Box className="desktop-sidebar">
        <Sidebar page={page} setPage={setPage} />
      </Box>
      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        <Sidebar
          page={page}
          setPage={setPage}
          onClose={() => setDrawer(false)}
        />
      </Drawer>
      <div className="main">
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton className="mobile-menu" onClick={() => setDrawer(true)}>
              <Menu />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <span className="today">Friday, 11 September</span>
            <Avatar className="profile">{user.name[0]}</Avatar>
            <div className="profile-name">
              <strong>{user.name}</strong>
              <small>Administrator</small>
            </div>
            <Tooltip title="Sign out">
              <IconButton onClick={() => dispatch(logout())}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" className="content">
          {content}
        </Container>
      </div>
      <Snackbar
        open={!!notice}
        autoHideDuration={3200}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotice("")}
          severity="success"
          variant="filled"
        >
          {notice}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function App() {
  const user = useSelector((s: RootState) => s.auth.user);
  return user ? <Dashboard /> : <LoginPage />;
}

