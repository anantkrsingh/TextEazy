import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { CircularProgress, Grid, Typography, Box } from "@mui/material";
import apiHelper from "../../../utils/api";

const Home = () => {
  const [docName, setDocName] = useState("");
  const [saveToDrive, setSaveToDrive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      setFetching(true);
      try {
        const res = await apiHelper.get("/docs");
        setDocuments(res);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleSave = async () => {
    if (!docName.trim()) {
      alert("Please enter a document name.");
      return;
    }

    const payload = { name: docName, saveToDrive, content: {} };

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await apiHelper.post("/docs/create", payload);

      setDocName("");
      setSaveToDrive(false);

      navigate(`/dashboard/editor/${res.docId}`);
    } catch (error) {
      setErrorMessage(`Failed to create new document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col items-center p-6 min-h-screen">
      <Typography variant="h4" color="black" className="mb-6">
        Recent Documents
      </Typography>

      {fetching ? (
        <Box className="flex justify-center items-center w-full h-80">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {documents.map((doc) => (
            <Grid
              item
              key={doc.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => navigate(`/dashboard/editor/${doc._id}`)}
            >
              <Box
                className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center transition-all duration-300 hover:bg-gray-100"
                sx={{ width: "280px", height: "200px" }}
              >
                <Typography
                  variant="h6"
                  className="text-gray-800 group-hover:text-black"
                >
                  {doc.name}
                </Typography>
              </Box>
            </Grid>
          ))}

          <Grid item>
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <Box
                  className="bg-white shadow-md rounded-lg flex flex-col justify-center items-center cursor-pointer transition-all duration-300 hover:bg-gray-200"
                  sx={{ width: "280px", height: "200px" }}
                >
                  <Plus size={32} className="text-gray-600 mb-2" />
                  <Typography variant="body1" className="text-gray-800">
                    Add New Document
                  </Typography>
                </Box>
              </AlertDialog.Trigger>

              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none">
                  <Typography variant="h5" className="mb-4">
                    Create New Document
                  </Typography>

                  {errorMessage && (
                    <Typography variant="body2" color="error" className="mb-4">
                      {errorMessage}
                    </Typography>
                  )}

                  <div className="relative mb-4">
                    <label
                      htmlFor="docName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Document Name
                    </label>
                    <input
                      id="docName"
                      type="text"
                      placeholder="Enter document name"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="mt-1 block text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {docName && (
                      <button
                        type="button"
                        onClick={() => setDocName("")}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="saveToDrive"
                      checked={saveToDrive}
                      onChange={() => setSaveToDrive(!saveToDrive)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="saveToDrive" className="text-gray-700">
                      Save to Google Drive
                    </label>
                  </div>

                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <button
                        disabled={loading}
                        className={`bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Home;
