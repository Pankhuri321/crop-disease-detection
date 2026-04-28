import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json

# =========================
# DATASET PATH
# =========================
data_path = r"dataset/archive (4)/PlantVillage"

# =========================
# PREPROCESSING
# =========================
datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

train_data = datagen.flow_from_directory(
    data_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

val_data = datagen.flow_from_directory(
    data_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# =========================
# CNN MODEL
# =========================
model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(train_data.num_classes, activation='softmax')
])

# =========================
# COMPILE MODEL
# =========================
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# =========================
# TRAIN MODEL
# =========================
model.fit(
    train_data,
    validation_data=val_data,
    epochs=10
)

# =========================
# SAVE CLASS NAMES (VERY IMPORTANT)
# =========================
class_indices = train_data.class_indices

# Reverse mapping: index → class name
class_names = {v: k for k, v in class_indices.items()}

with open("class_names.json", "w") as f:
    json.dump(class_names, f)

print("✅ Class names saved!")

# =========================
# SAVE MODEL
# =========================
model.save("Crop_project_model.h5")

print("✅ Training complete! Model saved.")
