package com.example.androidgiffy;

import android.inputmethodservice.InputMethodService;
import android.inputmethodservice.KeyboardView;
import android.view.View;
import android.widget.GridView;

public class MyInputMethodService extends InputMethodService implements KeyboardView.OnKeyboardActionListener {

    @Override
    public View onCreateInputView() {
        // Inflate the keyboard layout
        View keyboardView = getLayoutInflater().inflate(R.layout.keyboard_layout, null);

        // Find the GridView or RecyclerView in the keyboard layout
        GridView gridView = keyboardView.findViewById(R.id.grid_view);

        // Create a new ImageAdapter
        ImageAdapter imageAdapter = new ImageAdapter(this);

        // Set the ImageAdapter as the adapter for the GridView
        gridView.setAdapter(imageAdapter);

        // Fetch and display images of dogs from the Dog API
        imageAdapter.fetchImages();

        // Return the keyboard layout
        return keyboardView;
    }

    @Override
    public void onPress(int i) {

    }

    @Override
    public void onRelease(int i) {

    }

    @Override
    public void onKey(int primatyCode, int[] keyCodes) {

    }

    @Override
    public void onText(CharSequence charSequence) {

    }

    @Override
    public void swipeLeft() {

    }

    @Override
    public void swipeRight() {

    }

    @Override
    public void swipeDown() {

    }

    @Override
    public void swipeUp() {

    }
}
