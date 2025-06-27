#include <NewPing.h>
#include <SoftwareSerial.h>

#define TRIGGER_PIN 2 // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN 3    // Arduino pin tied to echo pin on the ultrasonic sensor.
                      
#define BLUETOOTH_RX 7
#define BLUETOOTH_TX 8

#define SOUND_PIN 9

// Initialize the ultrasonic sensor
NewPing sonar(TRIGGER_PIN, ECHO_PIN, 2000); // Trigger pin, Echo pin, max distance in cm
SoftwareSerial bluetooth(BLUETOOTH_RX, BLUETOOTH_TX);

void setup() {
  pinMode(SOUND_PIN, OUTPUT);

  Serial.begin(9600);
  bluetooth.begin(9600);
}


void loop() {
  // Read distance from the sensor
  int distance = sonar.ping_cm();

  // Sound when there's an obstacle closer than 10 cm
  if (distance != 0 and distance <= 10){
    digitalWrite(SOUND_PIN, HIGH); 
  } else {
    digitalWrite(SOUND_PIN, LOW);
  }

  // Check for Bluetooth commands
  if (bluetooth.available()) {
    Serial.println("Bluetooth command received");
    char command = bluetooth.read();
    Serial.println(command);
  }
}
