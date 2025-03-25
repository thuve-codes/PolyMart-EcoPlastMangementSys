import PlasticRequest from "../Models/PlasticRequest.js";

// Create a new plastic collection request
export const createRequest = async (req, res) => {
  try {
    const { user, plasticType, quantityKg, location } = req.body;

    const newRequest = new PlasticRequest({
      user,
      plasticType,
      quantityKg,
      location,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request created successfully", newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all plastic requests
export const getRequests = async (req, res) => {
  try {
    const requests = await PlasticRequest.find().populate("user", "name email");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await PlasticRequest.findById(req.params.id).populate("user", "name email");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a request by ID
export const updateRequest = async (req, res) => {
  try {
    const updatedRequest = await PlasticRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request updated successfully", updatedRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a request by ID
export const deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await PlasticRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
