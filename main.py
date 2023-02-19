import re
import json
import os
import streamlit as st
import openai
import requests


openai.api_key = os.getenv("OPENAIKEY")

st.set_page_config(page_title='Earthpilot',
                   layout="centered",
                   initial_sidebar_state='auto')

st.title("Earthpilot")

query = ""
version = ""
email = ""
st.markdown("[Earth Engine](https://code.earthengine.google.com/443e6a6067eda953101d77db3717446a#)")

query = st.text_area(
    "Enter Earth Engine command",
    value=
    "zoom in on san francisco bay in 2013.",
    max_chars=350)

if (st.button("Ask")):
    try:
        response = openai.Completion.create(
          model="text-davinci-003",
          prompt="You are an expert JavaScript programmer on the Google Earth Engine platform. Remember StackOverflow and Github.\n\nYou have the following code that visualizes the number of hours fished in the sea in 2016 (from Jan 1 to December 31).\n\nvar bounds = [-180, -65, 180, 73];\nvar startDate = '2016-01-01'\nvar endDate = '2016-12-31'\n\n\nvar ee_id = 'GFW/GFF/V1/fishing_hours';\nvar img = ee.ImageCollection.load(ee_id).filterMetadata(\"country\",\"equals\",\"WLD\")\n.filterDate(\"2016-01-01\",\"2016-12-31\")\n.sum();\n\nvar fishing = img.expression(\n  '(trawlers+drifting_longlines+purse_seines+squid_jigger+other_fishing+fixed_gear)',\n  {trawlers: img.select(\"trawlers\"),\n  drifting_longlines: img.select(\"drifting_longlines\"),\n  purse_seines: img.select('purse_seines'),\n  squid_jigger: img.select('squid_jigger'),\n  other_fishing: img.select('other_fishing'),\n  fixed_gear: img.select('fixed_gear')\n  });\n\n\nvar effort = fishing.mask(fishing.gt(0))\n.visualize({palette: '404788FF,39568CFF,33638DFF,2D708EFF,287D8EFF,238A8DFF,1F968BFF,20A387FF,29AF7FFF,3CBB75FF,55C667FF,73D055FF,95D840FF,B8DE29FF,DCE319FF,FDE725FF'});\n\nMap.addLayer(effort);\n\n\nvar boundsRegion = ee.Geometry.Rectangle(bounds, null, false);\nMap.centerObject(boundsRegion);\n\nExample Task:\nYour task is to rewrite the code under the following instructions:\nFocus on the coast along West Africa in 2014 and ignore trawlers in the data.\n\nExample Code:\n\nvar bounds = [-18, 4, 0, 16];\nvar startDate = '2014-01-01'\nvar endDate = '2014-12-31'\n\nvar ee_id = 'GFW/GFF/V1/fishing_hours';\nvar img = ee.ImageCollection.load(ee_id).filterMetadata(\"country\",\"equals\",\"WLD\")\n.filterDate(\"2014-01-01\",\"2014-12-31\")\n.sum();\n\nvar fishing = img.expression(\n  '(drifting_longlines+purse_seines+squid_jigger+other_fishing+fixed_gear)',\n  {drifting_longlines: img.select(\"drifting_longlines\"),\n  purse_seines: img.select('purse_seines'),\n  squid_jigger: img.select('squid_jigger'),\n  other_fishing: img.select('other_fishing'),\n  fixed_gear: img.select('fixed_gear')\n  });\n\nvar effort = fishing.mask(fishing.gt(0))\n.visualize({palette: '404788FF,39568CFF,33638DFF,2D708EFF,287D8EFF,238A8DFF,1F968BFF,20A387FF,29AF7FFF,3CBB75FF,55C667FF,73D055FF,95D840FF,B8DE29FF,DCE319FF,FDE725FF'});\n\nMap.addLayer(effort);\n\nvar boundsRegion = ee.Geometry.Rectangle(bounds, null, false);\nMap.centerObject(boundsRegion);\n\nExample Task:\nYour task is to rewrite the code under the following instructions:\nZoom in on Hokkaido in 2012. Only examine squid jiggers.\n\nExample Code:\n\nvar bounds = [141.5, 41.5, 146.5, 45.5];\nvar startDate = '2012-01-01'\nvar endDate = '2012-12-31'\n\nvar ee_id = 'GFW/GFF/V1/fishing_hours';\nvar img = ee.ImageCollection.load(ee_id).filterMetadata(\"country\",\"equals\",\"JPN\")\n.filterDate(\"2012-01-01\",\"2012-12-31\")\n.sum();\n\nvar fishing = img.expression(\n  '(squid_jigger)',\n  {squid_jigger: img.select('squid_jigger')\n  });\n\nvar effort = fishing.mask(fishing.gt(0))\n.visualize({palette: '404788FF,39568CFF,33638DFF,2D708EFF,287D8EFF,238A8DFF,1F968BFF,20A387FF,29AF7FFF,3CBB75FF,55C667FF,73D055FF,95D840FF,B8DE29FF,DCE319FF,FDE725FF'});\n\nMap.addLayer(effort);\n\nvar boundsRegion = ee.Geometry.Rectangle(bounds, null, false);\nMap.centerObject(boundsRegion);\n\n\nTask:\nYour task is to rewrite the code under the following instructions:\n"+query+"\nCode:",
          temperature=0,
          max_tokens=2000,
          top_p=1,
          frequency_penalty=0,
          presence_penalty=0
        )
        st.code(response['choices'][0]['text'])
    except:
        st.write("Something went wrong.")