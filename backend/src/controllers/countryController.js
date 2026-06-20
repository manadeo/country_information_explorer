import Country from "../models/Country.js";

export const getCountries = async (req, res) => {
  try {
    const { search, region, sortBy, order, page = 1, limit = 12 } = req.query;
    const query = {};

    // Search matching name, officialName, capital, or cca3
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { officialName: { $regex: search, $options: "i" } },
        { capital: { $regex: search, $options: "i" } },
        { cca3: { $regex: search, $options: "i" } },
      ];
    }

    if (region) {
      query.region = { $regex: `^${region}$`, $options: "i" };
    }

    const sortObj = {};
    if (sortBy) {
      const sortOrder = order === "desc" ? -1 : 1;
      sortObj[sortBy] = sortOrder;
    } else {
      sortObj.name = 1; // Default sort by name ascending
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Country.countDocuments(query);
    const countries = await Country.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: countries.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      data: countries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching countries",
      error: error.message,
    });
  }
};

export const getCountryById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Country ID format",
      });
    }

    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching country",
      error: error.message,
    });
  }
};

export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const country = await Country.findOne({ cca3: code.toUpperCase() });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: `Country with code ${code.toUpperCase()} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error fetching country by code",
      error: error.message,
    });
  }
};
