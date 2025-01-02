# orbital-eye-e02-visualize

## Miscelaneous Links

### d3js satellite tracker - earth
* https://observablehq.com/@jake-low/satellite-ground-track-visualizer

![d3js earth](../../../apps/orbital-eye/public/docs/images/d3js-earth.png)

### d3js satellite tracker - mars
* https://observablehq.com/@mammoth80/satellite-ground-track-visualizer

![d3js mars](../../../apps/orbital-eye/public/docs/images/d3js-mars.png)

### d3js satellite view of earth
* https://observablehq.com/@d3/satellite
* https://observablehq.com/@d3/satellite-explorer

### d3js intro
* https://observablehq.com/@mitvis/introduction-to-d3

## Space Track Earth-Orbiting Data Download

The [general perturbations (GP)](https://www.space-track.org/documentation#api-basicSpaceDataGp) class is an efficient listing of the newest SGP4 keplerian element set for each man-made earth-orbiting object tracked by the 18th Space Defense Squadron. It is designed to accommodate the expanded satellite catalog’s 9-digit identifiers. Users can return data in the CCSDS flexible Orbit Mean-Elements Message (OMM) format in canonical XML/KVN, JSON, CSV, or HTML. All 5 of these formats use the same keywords and definitions for OMM as provided in the Orbit Data Messages (ODM) [CCSDS Recommended Standard 502.0-B-3](https://public.ccsds.org/Pubs/502x0b3e1.pdf)

Select catalog numbers below 100,000 are also available in the legacy fixed-width TLE or 3LE format. While the [Alpha-5](https://www.space-track.org/documentation#/tle-alpha5) schema extends the range that the TLE format supports to include numbers up to 339,999, https://Space-Track.org and https://Celestrak.com recommend that developers migrate their software to use the OMM standard for all GP ephemerides. Please see the [Alpha-5 documentation](https://www.space-track.org/documentation#/tle-alpha5) for more on this.

Note: Alpha-5 formatted ELSETs will only be available through the TLE and 3LE formats of the gp and gp_history class.

This class also allows for expanded elset filtering based on additional object metadata from the satellite catalog like:
radar cross section (RCS_SIZE): Small, Medium, Large
object type (OBJECT_TYPE): Payload, Rocket Body, Debris, Unknown
launch site (SITE)
launch date (LAUNCH_DATE)
decay date (DECAY_DATE)
country code (COUNTRY_CODE)
file identifier for groups uploaded together (FILE)
unique ephemerides identifier (GP_ID)
... if such values exist for the object. Note that many analyst satellite objects' catalog numbers above 70,000 do not have much metadata.

Please see all available columns for filtering by viewing the [gp class's model definition](https://www.space-track.org/basicspacedata/modeldef/class/gp/format/html).

Note: Queries made in HTML, JSON, and CSV will contain the TLE lines as fields (TLE_LINE0, TLE_LINE1, TLE_LINE2). The OMM (XML/KVN) formats do not contain these fields in order to save space and eliminate redundancy.

The recommended URL for retrieving the newest propagable element set for all on-orbit objects is:
https://www.space-track.org/basicspacedata/query/class/gp/decay_date/null-val/epoch/%3Enow-30/orderby/norad_cat_id/format/json

Each entry in the dataset stores detailed orbital and metadata information for satellites, conforming to the CCSDS OMM standard.

---

### **Field Descriptions**

| Field                   | Type                    | Null | Key  | Default | Extra         | Description                                                              |
|-------------------------|-------------------------|------|------|---------|---------------|--------------------------------------------------------------------------|
| **CCSDS_OMM_VERS**      | `varchar(3)`           | NO   |      |         |               | Version of the CCSDS OMM standard.                                      |
| **COMMENT**             | `varchar(33)`          | NO   |      |         |               | Descriptive comment about the data set.                                 |
| **CREATION_DATE**       | `datetime`             | YES  |      |         |               | Date and time the record was created.                                   |
| **ORIGINATOR**          | `varchar(7)`           | NO   |      |         |               | Entity responsible for generating the data.                             |
| **OBJECT_NAME**         | `varchar(25)`          | YES  |      |         |               | Common name of the satellite.                                           |
| **OBJECT_ID**           | `varchar(12)`          | YES  |      |         |               | Unique identifier for the satellite.                                    |
| **CENTER_NAME**         | `varchar(5)`           | NO   |      |         |               | Name of the celestial center, typically `EARTH`.                        |
| **REF_FRAME**           | `varchar(4)`           | NO   |      |         |               | Reference frame, typically `TEME`.                                      |
| **TIME_SYSTEM**         | `varchar(3)`           | NO   |      |         |               | Time system used, typically `UTC`.                                      |
| **MEAN_ELEMENT_THEORY** | `varchar(4)`           | NO   |      |         |               | Theory used for mean orbital elements, typically `SGP4`.                |
| **EPOCH**               | `datetime(6)`          | YES  |      |         |               | Epoch of the orbital elements.                                          |
| **MEAN_MOTION**         | `decimal(13,8)`        | YES  |      |         |               | Mean motion (revolutions per day).                                      |
| **ECCENTRICITY**        | `decimal(13,8)`        | YES  |      |         |               | Orbital eccentricity.                                                   |
| **INCLINATION**         | `decimal(7,4)`         | YES  |      |         |               | Orbital inclination (degrees).                                          |
| **RA_OF_ASC_NODE**      | `decimal(7,4)`         | YES  |      |         |               | Right ascension of the ascending node (degrees).                        |
| **ARG_OF_PERICENTER**   | `decimal(7,4)`         | YES  |      |         |               | Argument of perigee (degrees).                                          |
| **MEAN_ANOMALY**        | `decimal(7,4)`         | YES  |      |         |               | Mean anomaly (degrees).                                                 |
| **EPHEMERIS_TYPE**      | `tinyint(4)`           | YES  |      | `0`     |               | Ephemeris type indicator.                                               |
| **CLASSIFICATION_TYPE** | `char(1)`              | YES  |      |         |               | Classification type (`U` for unclassified).                             |
| **NORAD_CAT_ID**        | `int(10) unsigned`     | NO   |      |         |               | NORAD catalog ID.                                                       |
| **ELEMENT_SET_NO**      | `smallint(5) unsigned` | YES  |      |         |               | Element set number.                                                     |
| **REV_AT_EPOCH**        | `mediumint(8) unsigned`| YES  |      |         |               | Revolution number at epoch.                                             |
| **BSTAR**               | `decimal(19,14)`       | YES  |      |         |               | BSTAR drag term.                                                        |
| **MEAN_MOTION_DOT**     | `decimal(9,8)`         | YES  |      |         |               | First derivative of mean motion.                                        |
| **MEAN_MOTION_DDOT**    | `decimal(22,13)`       | YES  |      |         |               | Second derivative of mean motion.                                       |
| **SEMIMAJOR_AXIS**      | `double(12,3)`         | YES  |      |         |               | Semi-major axis (km).                                                   |
| **PERIOD**              | `double(12,3)`         | YES  |      |         |               | Orbital period (minutes).                                               |
| **APOAPSIS**            | `double(12,3)`         | YES  |      |         |               | Apogee altitude (km).                                                   |
| **PERIAPSIS**           | `double(12,3)`         | YES  |      |         |               | Perigee altitude (km).                                                  |
| **OBJECT_TYPE**         | `varchar(12)`          | YES  |      |         |               | Type of object (e.g., `PAYLOAD`, `ROCKET BODY`).                        |
| **RCS_SIZE**            | `char(6)`              | YES  |      |         |               | Radar cross-section size (`SMALL`, `MEDIUM`, `LARGE`).                  |
| **COUNTRY_CODE**        | `char(6)`              | YES  |      |         |               | Country code of ownership.                                              |
| **LAUNCH_DATE**         | `date`                | YES  |      |         |               | Launch date of the object.                                              |
| **SITE**                | `char(5)`              | YES  |      |         |               | Launch site.                                                            |
| **DECAY_DATE**          | `date`                | YES  |      |         |               | Decay date (if applicable).                                             |
| **FILE**                | `bigint(20) unsigned`  | YES  |      |         |               | File identifier.                                                        |
| **GP_ID**               | `int(10) unsigned`    | NO   |      |         |               | Unique identifier for the GP record.                                    |
| **TLE_LINE0**           | `varchar(27)`          | YES  |      |         |               | TLE line 0 (name of the satellite).                                     |
| **TLE_LINE1**           | `varchar(71)`          | YES  |      |         |               | TLE line 1 containing orbital elements.                                 |
| **TLE_LINE2**           | `varchar(71)`          | YES  |      |         |               | TLE line 2 containing orbital elements.                                 |

---

### **Key Points**
- The table supports CCSDS OMM standard for orbital metadata.
- TLE data (line 0, 1, and 2) is stored for compatibility with SGP4 propagation models.
- Fields like `NORAD_CAT_ID`, `OBJECT_NAME`, and `GP_ID` are critical for uniquely identifying satellites.
- Orbital parameters (e.g., `ECCENTRICITY`, `INCLINATION`) support accurate orbital calculations.

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test orbital-eye-e02-visualize` to execute the unit tests via [Jest](https://jestjs.io).
