//
//  KeyboardViewController.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-17.
//

import UIKit
import SwiftUI

struct KeyboardData {
    var images: [URL] = []
}

class KeyboardViewController: UIInputViewController {
    
    @IBOutlet var nextKeyboardButton: UIButton!
    var giffyBoardView: UIView?
    
    override func updateViewConstraints() {
        super.updateViewConstraints()
        
        // Add custom view sizing constraints here
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Perform custom UI setup here
        
        // Set background color to match the default keyboard background
        self.view.backgroundColor = UIColor.systemBackground
        
        // Adding GiffyBoardView
        let giffyBoardView = GiffyBoardView(keyboardViewController: self)
        let hostingController = UIHostingController(rootView: giffyBoardView)
        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.didMove(toParent: self)
        self.giffyBoardView = hostingController.view
        
        // Resize GiffyBoardView to match keyboard size
        self.giffyBoardView?.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // Adding button to go the next keyboard
        self.nextKeyboardButton = UIButton(type: .system)

        self.nextKeyboardButton.setTitle("⌨️", for: [])
        self.nextKeyboardButton.sizeToFit()
        self.nextKeyboardButton.translatesAutoresizingMaskIntoConstraints = false

        self.nextKeyboardButton.addTarget(self, action: #selector(handleInputModeList(from:with:)), for: .allTouchEvents)

        self.view.addSubview(self.nextKeyboardButton)

        self.nextKeyboardButton.leftAnchor.constraint(equalTo: self.view.leftAnchor, constant: 10).isActive = true
        self.nextKeyboardButton.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: 10).isActive = true
        self.nextKeyboardButton.widthAnchor.constraint(equalToConstant: 50).isActive = true
        self.nextKeyboardButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // Remove the GiffyBoardView when the keyboard is dismissed
        self.giffyBoardView?.removeFromSuperview()
    }
    
    override func viewWillLayoutSubviews() {
        self.nextKeyboardButton.isHidden = !self.needsInputModeSwitchKey
        super.viewWillLayoutSubviews()
    }
    
    override func textWillChange(_ textInput: UITextInput?) {
        // The app is about to change the document's contents. Perform any preparation here.
    }
    
    override func textDidChange(_ textInput: UITextInput?) {
        // The app has just changed the document's contents, the document context has been updated.
        
        var textColor: UIColor
        let proxy = self.textDocumentProxy
        if proxy.keyboardAppearance == UIKeyboardAppearance.dark {
            textColor = UIColor.white
        } else {
            textColor = UIColor.black
        }
        self.nextKeyboardButton.setTitleColor(textColor, for: [])
    }
}
