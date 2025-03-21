export async function requestSerialPort(): Promise<USBSerialPort | null> {
    try {
      if (!("serial" in navigator)) {
        console.error("Web Serial API no es compatible con este navegador.");
        return null;
      }
  
      const port = await navigator.serial.requestPort(); // Pedir puerto
      await port.open({ baudRate: 9600 }); // Abrir con baud rate de 9600
      console.log("Puerto serie abierto correctamente.");
      return port;
    } catch (error) {
      console.error("Error al abrir el puerto serie:", error);
      return null;
    }
  }
  
  export async function parseSerialData(data: string): Promise<{
    temperature?: number;
    humidity?: number;
    noise?: number;
    airQuality?: number;
  }> {
    try {
      const result: {
        temperature?: number;
        humidity?: number;
        noise?: number;
        airQuality?: number;
      } = {};
  
      const parts = data.split(",");
  
      for (const part of parts) {
        const [key, valueStr] = part.split(":");
        const value = Number.parseFloat(valueStr);
  
        if (!isNaN(value)) {
          switch (key) {
            case "T":
              result.temperature = value;
              break;
            case "H":
              result.humidity = value;
              break;
            case "N":
              result.noise = value;
              break;
            case "A":
              result.airQuality = value;
              break;
          }
        }
      }
  
      return result;
    } catch (error) {
      console.error("Error al analizar los datos serie:", error);
      return {};
    }
  }
  
  export function readSerialStream(port: USBSerialPort): ReadableStream<string> {
    if (!port.readable) {
      throw new Error("El puerto serie no tiene flujo de lectura.");
    }
  
    const reader = port.readable.getReader();
    const textDecoder = new TextDecoder();
    let buffer = "";
  
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              break;
            }
  
            buffer += textDecoder.decode(value);
  
            // Separar los datos por líneas
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Guardar la última línea incompleta
  
            for (const line of lines) {
              if (line.trim()) {
                controller.enqueue(line.trim());
              }
            }
          }
        } catch (error) {
          console.error("Error al leer desde el puerto serie:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
  
      cancel() {
        reader.releaseLock();
      },
    });
  }
  
  // Función para iniciar la lectura del puerto serie
  export async function startSerialCommunication() {
    const port = await requestSerialPort();
    if (!port) return;
  
    const stream = readSerialStream(port);
    const reader = stream.getReader();
  
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        if (value) {
          console.log("Datos recibidos:", value);
          const parsedData = await parseSerialData(value);
          console.log("Datos procesados:", parsedData);
        }
      }
    } catch (error) {
      console.error("Error en la comunicación serie:", error);
    } finally {
      reader.releaseLock();
    }
  }
  
  // Llamar a la función para iniciar la conexión
  startSerialCommunication();
  