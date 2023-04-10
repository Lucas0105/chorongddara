package com.ssafy.chorongddara.api.controller;

import com.ssafy.chorongddara.api.request.GalleryMakeReq;
import com.ssafy.chorongddara.api.service.GalleryService;
import com.ssafy.chorongddara.common.codes.ErrorCode;
import com.ssafy.chorongddara.common.codes.SuccessCode;
import com.ssafy.chorongddara.common.exception.BusinessExceptionHandler;
import com.ssafy.chorongddara.common.response.ApiResponse;
import com.ssafy.chorongddara.common.util.TokenUtil;
import com.ssafy.chorongddara.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;

import com.ssafy.chorongddara.api.service.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/galleries")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;
    @Autowired
    private UserService userService;
    @Autowired
    private TokenUtil tokenUtil;

    @Value("${file.upload.path}")
    String rootpath;

    @PostMapping()
    public ResponseEntity<ApiResponse<Object>> makeGallery(@RequestBody GalleryMakeReq galleryMakeReq,
                                                           @RequestHeader("Authorization") String accessToken) {
        String token = tokenUtil.getTokenFromHeader(accessToken);
        String email = tokenUtil.getUserIdFromToken(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(()->new BusinessExceptionHandler("유저가 없습니다.", ErrorCode.BUSINESS_EXCEPTION_ERROR));
        Integer userId = user.getUserId();

//        System.out.println(rootpath);
//
//        // 내가 업로드 파일을 저장할 경로
//        String uploadFolder = rootpath + "gallery" + "/";
//        UUID uuid = UUID.randomUUID();
//        String pictureName = uuid.toString() + pictureFile.getOriginalFilename();
//        // 저장할 파일, 생성자로 경로와 이름을 지정해줌.
//        File saveFile = new File(uploadFolder, pictureName);
//
//        try {
//            // void transferTo(File dest) throws IOException 업로드한 파일 데이터를 지정한 파일에 저장
//            pictureFile.transferTo(saveFile);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        galleryService.makeGallery(galleryMakeReq.getCulturalPropertyId(), galleryMakeReq.getPicture(), userId);
        ApiResponse<Object> ar = ApiResponse.builder()
                .result(null)
                .resultCode(SuccessCode.INSERT.getStatus())
                .resultMsg(SuccessCode.INSERT.getMessage())
                .build();
        return new ResponseEntity<>(ar, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<Object>> getGallery(@RequestHeader("Authorization") String accessToken) {
        String token = tokenUtil.getTokenFromHeader(accessToken);
        String email = tokenUtil.getUserIdFromToken(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(()->new BusinessExceptionHandler("유저가 없습니다.", ErrorCode.BUSINESS_EXCEPTION_ERROR));
        Integer userId = user.getUserId();
        List<String> pictureList = galleryService.getGallery(userId);
        ApiResponse<Object> ar = ApiResponse.builder()
                .result(pictureList)
                .resultCode(SuccessCode.SELECT.getStatus())
                .resultMsg(SuccessCode.SELECT.getMessage())
                .build();
        return new ResponseEntity<>(ar, HttpStatus.OK);
    }

    @GetMapping("/{culturalPropertyId}")
    public ResponseEntity<ApiResponse<Object>> getGalleryAboutCulturalProperty(@RequestHeader("Authorization") String accessToken,
                                                                               @PathVariable("culturalPropertyId") Integer culturalPropertyId) {
        String token = tokenUtil.getTokenFromHeader(accessToken);
        String email = tokenUtil.getUserIdFromToken(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(()->new BusinessExceptionHandler("유저가 없습니다.", ErrorCode.BUSINESS_EXCEPTION_ERROR));
        Integer userId = user.getUserId();
        List<String> pictureList = galleryService.getGalleryAboutCulturalProperty(userId, culturalPropertyId);
        ApiResponse<Object> ar = ApiResponse.builder()
                .result(pictureList)
                .resultCode(SuccessCode.SELECT.getStatus())
                .resultMsg(SuccessCode.SELECT.getMessage())
                .build();
        return new ResponseEntity<>(ar, HttpStatus.OK);
    }
}
