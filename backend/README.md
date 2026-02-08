# Parking Spot Detection System

An AI-powered parking spot detection system using YOLO object detection to monitor parking lot occupancy in real-time. The system identifies vehicles and determines which parking spots are occupied or available, with optional MongoDB integration for data storage.

## Features

- 🚗 Real-time vehicle detection using YOLOv8
- 📍 Interactive parking spot coordinate selection
- 🎨 Visual display with color-coded spots (Blue = Occupied, Green = Available)
- 🗄️ MongoDB integration for storing lot definitions and occupancy data
- 📊 Normalized coordinates for cross-resolution compatibility
- ⚡ Efficient state-change-based database updates

## Requirements

- Python 3.8+
- OpenCV
- YOLOv8 (ultralytics)
- MongoDB (optional, for data persistence)

## Installation

### 1. Clone or Download the Project

```bash
cd mac-a-thon
```

### 2. Install Python Dependencies

```bash
pip install opencv-python numpy pyyaml ultralytics pymongo python-dotenv
```

Or use the requirements file:

```bash
pip install -r requirements.txt
```

### 3. Install MongoDB (Optional)

**Option A: Local MongoDB**

- Download from https://www.mongodb.com/try/download/community
- Install and start the MongoDB service

**Option B: MongoDB Atlas (Free Cloud)**

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

**Option C: Docker**

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` with your MongoDB connection details:

```env
# For local MongoDB
MONGO_URI=mongodb://localhost:27017/

# For MongoDB Atlas (replace with your actual credentials)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=app-name

DB_NAME=mac-a-park-db
USE_MONGODB=True
```

**⚠️ Important**: Never commit your `.env` file with real credentials to version control!

## Usage

### Step 1: Generate Parking Spot Coordinates

Run the program and select the coordinate generation mode:

```bash
python main.py
```

When prompted:

```
Enter 'g' to generate coordinates, 'd' to detect parking: g
```

#### Input Requirements:

1. **Lot ID** (e.g., `lot-001`)
   - A unique identifier for this parking lot
   - Use alphanumeric characters and dashes
   - Example: `lot-001`, `main-campus`, `building-a-parking`

2. **Lot Name** (e.g., `Main Campus Parking`)
   - A human-readable name for the lot
   - Example: `Main Campus Parking`, `Building A South Lot`

#### Defining Parking Spots:

After entering lot information, an image window will open:

1. **Click 4 corners** of each parking spot in order (clockwise or counter-clockwise)
2. The system will draw the polygon and label it with a number
3. **Repeat** for each parking spot you want to monitor
4. Press **`q`** when you're done defining all spots
5. Press **`r`** to reset if you make a mistake

**Output**:

- Creates `parking_coords.yml` with spot coordinates
- Saves lot definition to MongoDB (if enabled)

### Step 2: Run Parking Detection

Run the program and select detection mode:

```bash
python main.py
```

When prompted:

```
Enter 'g' to generate coordinates, 'd' to detect parking: d
```

#### Input Requirements:

1. **Lot ID** (e.g., `lot-001`)
   - Must match the Lot ID you used when generating coordinates
   - This links the detection to the correct parking lot in the database

#### What Happens:

- Opens a video window showing the parking lot
- Detects vehicles using YOLO
- Overlays colored polygons on parking spots:
  - **🔵 Blue** = Spot is OCCUPIED (car detected)
  - **🟢 Green** = Spot is AVAILABLE (no car)
- Updates MongoDB when spot status changes
- Press **`q`** to quit

## File Configuration

Edit these variables in `main.py` before running:

```python
data_file = "parking_coords.yml"  # Coordinates storage file
image_file = "macPark.png"        # Reference image for spot selection
video_file = "macPark.mp4"        # Video to analyze
```

## Project Structure

```
mac-a-thon/
├── main.py                      # Main entry point
├── yolo_detector.py             # YOLO-based detection logic
├── coordinates_generator.py     # Interactive spot selection
├── mongo_db.py                  # MongoDB handler
├── drawing_utils.py             # Visualization utilities
├── colors.py                    # Color definitions
├── parking_coords.yml           # Generated spot coordinates
├── .env                         # Your MongoDB credentials (create from .env.example)
├── .env.example                 # Template for environment variables
└── README.md                    # This file
```

## MongoDB Data Schema

### Lot Definition Collection

```json
{
  "lot_id": "lot-001",
  "name": "Main Campus Parking",
  "spots": [
    {
      "spot_id": "0",
      "type": "standard",
      "polygon": [
        { "x": 0.123, "y": 0.456 },
        { "x": 0.234, "y": 0.567 },
        { "x": 0.345, "y": 0.678 },
        { "x": 0.456, "y": 0.789 }
      ]
    }
  ],
  "image_width": 1920,
  "image_height": 1080,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:00:00Z"
}
```

### Occupancy Status Collection

```json
{
  "lot_id": "lot-001",
  "spot_id": "0",
  "occupied": false,
  "last_updated": "2026-02-08T10:30:00Z",
  "video_source": "macPark.mp4"
}
```

## Advanced Configuration

### Adjust Detection Sensitivity

In `main.py`, modify:

```python
yolo_conf = 0.25  # Lower = more sensitive (0.1-0.5 recommended)
```

In `yolo_detector.py`, modify:

```python
OVERLAP_THRESHOLD = 0.2  # Fraction of spot covered to mark as occupied (0.1-0.5)
```

### Disable MongoDB

Set in `.env`:

```env
USE_MONGODB=False
```

The system will still work and display results visually.

## Tips for Best Results

1. **High-quality reference image**: Use a clear, well-lit image of the empty parking lot
2. **Consistent camera angle**: Video should match the reference image perspective
3. **Define spots accurately**: Click corners precisely for better detection
4. **Resolution matching**: Image and video should have the same dimensions
5. **Stable camera**: Works best with fixed/stationary cameras

## Example Workflow

```bash
# 1. Setup environment
copy .env.example .env
# Edit .env with your MongoDB credentials

# 2. Generate coordinates
python main.py
# Enter: g
# Enter Lot ID: campus-lot-a
# Enter Lot Name: Campus Parking Lot A
# Click 4 corners for each spot
# Press 'q' when done

# 3. Run detection
python main.py
# Enter: d
# Enter Lot ID: campus-lot-a
# Watch the detection in real-time
# Press 'q' to quit
```

## License

This project is for educational purposes as part of Mac-a-thon hackathon.
