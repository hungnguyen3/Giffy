//
//  GiffiesView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-21.
//

import SwiftUI

struct GiffiesView: View {
    let giffies: [GiffyDTO]
    
    var body: some View {
        if giffies.isEmpty {
            VStack {
                Image(systemName: "photo.on.rectangle.angled")
                    .font(.largeTitle)
                    .foregroundColor(.gray)
                Text("Empty collection")
                    .font(.title2)
                    .foregroundColor(.gray)
            }
        } else {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))], spacing: 15) {
                    ForEach(giffies, id: \.giffyId) { giffy in
                        GiffyCardView(giffy: giffy)
                    }
                }
                .padding()
            }
        }
    }
}

struct GiffyCardView: View {
    let giffy: GiffyDTO
    
    var body: some View {
        VStack {
            AsyncImage(url: URL(string: giffy.firebaseUrl)) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFit()
                case .failure:
                    Image(systemName: "exclamationmark.icloud.fill")
                        .font(.largeTitle)
                        .foregroundColor(.gray)
                @unknown default:
                    EmptyView()
                }
            }
            
            Text("\(giffy.giffyName) - \(giffy.likes) like\(giffy.likes != 1 ? "s" : "")")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

struct GiffiesView_Previews: PreviewProvider {
    static var previews: some View {
        let mockGiffies = [
            GiffyDTO(giffyId: 1, collectionId: 1, firebaseUrl: "https://www.example.com/image1.gif", firebaseRef: "image1.gif", giffyName: "Giffy 1", likes: 10),
            GiffyDTO(giffyId: 2, collectionId: 1, firebaseUrl: "https://www.example.com/image2.gif", firebaseRef: "image2.gif", giffyName: "Giffy 2", likes: 15),
            GiffyDTO(giffyId: 3, collectionId: 2, firebaseUrl: "https://www.example.com/image3.gif", firebaseRef: "image3.gif", giffyName: "Giffy 3", likes: 7),
            GiffyDTO(giffyId: 4, collectionId: 2, firebaseUrl: "https://www.example.com/image4.gif", firebaseRef: "image4.gif", giffyName: "Giffy 4", likes: 22),
            GiffyDTO(giffyId: 5, collectionId: 2, firebaseUrl: "https://www.example.com/image5.gif", firebaseRef: "image5.gif", giffyName: "Giffy 5", likes: 4)
        ]
        
        return GiffiesView(giffies: mockGiffies)
    }
}
