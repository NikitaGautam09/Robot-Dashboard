import asyncio
import websockets
import json

async def stream_data(websocket, path):
    # Read data from the .txt file
    with open('mission1.txt', 'r') as file:
        data = file.read().splitlines()

    # Send each line to the client as JSON
    for line in data:
        # Replace single quotes with double quotes
        line_with_double_quotes = line.replace("'", "\"")

        try:
            # Convert the modified string to a JSON object
            json_data = json.loads(line_with_double_quotes)
            
            # Send the JSON object to the client
            await websocket.send(json.dumps(json_data))
            
            # Adjust the sleep time as needed
            await asyncio.sleep(0.1)

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")

start_server = websockets.serve(stream_data, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
